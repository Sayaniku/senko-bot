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

const settingsPath = path.join(__dirname, '../../logSettings.json');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('utilisateur')?.value;
        const reason = interaction.options.get('raison')?.value || 'No reason provided';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId).catch(() => null);

        if (!targetUser) {
            await interaction.editReply("Cet utilisateur n'existe pas ou n'est pas dans ce serveur.");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply(
                "Vous ne pouvez pas kick le propriétaire du serveur."
            );
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply(
                "Vous ne pouvez pas kick cet utilisateur : son rôle est égal ou supérieur au vôtre."
            );
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply(
                "Je ne peux pas le kick : son rôle est égal ou supérieur au mien."
            );
            return;
        }

        try {
            await targetUser.kick(reason);
            await interaction.editReply(
                `L'utilisateur ${targetUser} a été kick.\nRaison : ${reason}`
            );
            const settings = JSON.parse(fs.readFileSync(settingsPath));
            const logChannelId = settings[interaction.guild.id];

            if (logChannelId) {
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('🦊 Renard kick')
                        .setColor(0xff0000)
                        .addFields(
                            { name: 'Utilisateur', value: `${targetUser}`, inline: true },
                            { name: 'Kick par', value: `${interaction.user}`, inline: true },
                            { name: 'Raison', value: reason }
                        )
                        .setTimestamp();

                    logChannel.send({ embeds: [logEmbed] }).catch(console.error);
                }
            }

        } catch (error) {
            console.log(`Erreur lors du kick : ${error}`);
            await interaction.editReply("Une erreur est survenue lors de l'exclusion.");
        }
    },

    name: 'kick',
    description: 'Exclure un renard du serveur.',
    options: [
        {
            name: 'utilisateur',
            description: 'Le renard à kick.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'raison',
            description: 'La raison de son kick.',
            type: ApplicationCommandOptionType.String,
            required: true, // tu peux mettre true si tu veux la rendre obligatoire
        },
    ],
    permissionsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers],
};
