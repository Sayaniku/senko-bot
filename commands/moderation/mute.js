const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    PermissionsBitField,
    EmbedBuilder,
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const ms = require('ms');

const settingsPath = path.join(__dirname, '../../logSettings.json');

module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('utilisateur')?.value;
        const duration = interaction.options.get('duration')?.value;
        const reason = interaction.options.get('raison')?.value || 'No reason provided';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId).catch(() => null);
        if (!targetUser) {
            await interaction.editReply("L'utilisateur n'existe pas ici.");
            return;
        }

        const msDuration = ms(duration);
        if (isNaN(msDuration)) {
            await interaction.editReply("Merci de mettre un temps valide (ex: `10m`, `1h`, `1d`).");
            return;
        }

        if (msDuration < 5000 || msDuration > 2.419e9) {
            await interaction.editReply("Le mute doit durer entre 5 secondes et 28 jours maximum.");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("Vous ne pouvez pas mute quelqu’un avec un rôle égal ou supérieur au vôtre.");
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("Je ne peux pas mute quelqu’un avec un rôle égal ou supérieur au mien.");
            return;
        }

        try {
            const { default: prettyMs } = await import('pretty-ms');

            let replyMsg = '';
            if (targetUser.isCommunicationDisabled()) {
                await targetUser.timeout(msDuration, reason);
                replyMsg = `${targetUser} a déjà un mute actif. Durée augmentée jusqu'à ${prettyMs(msDuration, { verbose: true })}\nRaison: ${reason}`;
            } else {
                await targetUser.timeout(msDuration, reason);
                replyMsg = `${targetUser} a été mute pendant ${prettyMs(msDuration, { verbose: true })}\nRaison: ${reason}`;
            }

            await interaction.editReply(replyMsg);

            // 🔔 Envoi des logs si configuré
            const settings = JSON.parse(fs.readFileSync(settingsPath));
            const logChannelId = settings[interaction.guild.id];

            if (logChannelId) {
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setTitle("🔇 Utilisateur Muté")
                        .setColor(0xffcc00)
                        .addFields(
                            { name: "Utilisateur", value: `${targetUser}`, inline: true },
                            { name: "Par", value: `${interaction.user}`, inline: true },
                            { name: "Durée", value: prettyMs(msDuration, { verbose: true }), inline: false },
                            { name: "Raison", value: reason }
                        )
                        .setTimestamp();

                    logChannel.send({ embeds: [embed] }).catch(console.error);
                }
            }

        } catch (error) {
            console.log(`Erreur pendant le mute : ${error}`);
            await interaction.editReply("Une erreur est survenue pendant le mute.");
        }
    },

    name: 'mute',
    description: 'Mute un renard.',
    options: [
        {
            name: 'utilisateur',
            description: `L'utilisateur à mute.`,
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'duration',
            description: 'Le temps du mute (30m, 1h, 1 day).',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'raison',
            description: 'La raison.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.MuteMembers],
};
