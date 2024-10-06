const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
} = require('discord.js');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('target-user').value;
        const reason =
            interaction.options.get('reason')?.value || 'No reason provided';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            await interaction.editReply("Qui est ce dernier, je ne le vois pas dans la liste des membres");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply(
                "Vous ne pouvez pas kick mon maitre"
            );
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply(
                "Malheureusement vous ne pouvez pas kick ce dernier, il est du meme rang social que vous"
            );
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply(
                "Je ne peut pas le kick, il est au dessus de moi ou a le meme role que moi."
            );
            return;
        }

        // Kick the targetUser
        try {
            await targetUser.kick({ reason });
            await interaction.editReply(
                `Le renard ${targetUser} a ete kick\nRaison: ${reason}\nhttps://cdn.ndprotect.com/img/cheh.gif`
            );
        } catch (error) {
            console.log(`Il y a eu une erreur: ${error}`);
        }
    },

    name: 'kick',
    description: 'Go exclure un membre du serveur (avec moderation).',
    options: [
        {
            name: 'target-user',
            description: `L'utilisateur a kick.`,
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'reason',
            description: 'La raison de pourquoi vous voulez le kick',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers],
};