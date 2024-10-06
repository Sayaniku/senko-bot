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
            await interaction.editReply("Je suis desole, mais je le ne trouve pas cette utilisateur ici");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply(
                "Vous le pouvez pas ban mon maitre, pauve fou."
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

        // Ban the targetUser
        try {
            await targetUser.ban({ reason });
            await interaction.editReply(
                `L'utilisateur ${targetUser} a ete ban\nRaison: ${reason}\nhttps://cdn.ndprotect.com/img/cheh.gif`
            );
        } catch (error) {
            console.log(`Il y a eu une erreur pendant le ban : ${error}`);
        }
    },

    name: 'ban',
    description: 'Bans a member from this server.',
    options: [
        {
            name: 'utilisateur',
            description: 'The user you want to ban.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'raison',
            description: 'The reason you want to ban.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
};