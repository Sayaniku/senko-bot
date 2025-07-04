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
    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('utilisateur')?.value;
        const reason = interaction.options.get('raison')?.value || 'No reason provided';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId).catch(() => null);

        if (!targetUser) {
            await interaction.editReply("Je suis désolé, mais je ne trouve pas cet utilisateur ici.");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply(
                "Vous ne pouvez pas bannir le propriétaire du serveur."
            );
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply(
                "Vous ne pouvez pas bannir cet utilisateur : son rôle est égal ou supérieur au vôtre."
            );
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply(
                "Je ne peux pas le bannir : son rôle est égal ou supérieur au mien."
            );
            return;
        }

        try {
            await targetUser.ban({ reason });

            await interaction.editReply(
                `L'utilisateur ${targetUser} a été banni.\nRaison: ${reason}\nhttps://cdn.ndprotect.com/img/cheh.gif`
            );

            // 🎯 Envoi dans le salon de logs (si défini)
            const settings = JSON.parse(fs.readFileSync(settingsPath));
            const logChannelId = settings[interaction.guild.id];

            if (logChannelId) {
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('🚫 Utilisateur banni')
                        .setColor(0xff0000)
                        .addFields(
                            { name: 'Utilisateur', value: `${targetUser}`, inline: true },
                            { name: 'Banni par', value: `${interaction.user}`, inline: true },
                            { name: 'Raison', value: reason }
                        )
                        .setTimestamp();

                    logChannel.send({ embeds: [logEmbed] }).catch(console.error);
                }
            }

        } catch (error) {
            console.log(`Erreur lors du ban : ${error}`);
            await interaction.editReply("Une erreur est survenue lors du bannissement.");
        }
    },

    name: 'ban',
    description: 'Bannir un renard du serveur.',
    options: [
        {
            name: 'utilisateur',
            description: 'Le renard à bannir.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'raison',
            description: 'La raison du ban.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
};
