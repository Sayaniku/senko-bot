const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */

    callback: async (client, interaction) => {
        const mentionable = interaction.options.get('target-user').value;
        const duration = interaction.options.get('duration').value; // 1d, 1 day, 1s 5s, 5m
        const reason = interaction.options.get('reason')?.value || 'No reason provided';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(mentionable);
        if (!targetUser) {
            await interaction.editReply("L'utilisateur n'existe pas ici");
            return;
        }

        if (targetUser.user.bot) {
            await interaction.editReply("Je ne peut pas mute mes confreres bot");
            return;
        }

        const msDuration = ms(duration);
        if (isNaN(msDuration)) {
            await interaction.editReply('Merci de mettre un temps valide');
            return;
        }

        if (msDuration < 5000 || msDuration > 2.419e9) {
            await interaction.editReply('Mute moins de 5 secondes ou plus de 28 jour.');
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("Malheureusement vous ne pouvez pas mute ce dernier, il est du meme rang social que vous.");
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("Malheureusement je ne peut pas mute ce dernier, il est du meme rang social que moi ou superieur.");
            return;
        }

        // Timeout the user
        try {
            const { default: prettyMs } = await import('pretty-ms');

            if (targetUser.isCommunicationDisabled()) {
                await targetUser.timeout(msDuration, reason);
                await interaction.editReply(`${targetUser} a eu son mute augmente jusqu'a ${prettyMs(msDuration, { verbose: true })}\nRaison: ${reason}`);
                return;
            }

            await targetUser.timeout(msDuration, reason);
            await interaction.editReply(`${targetUser} a ete mute pendant ${prettyMs(msDuration, { verbose: true })}.\nRaison: ${reason}`);
        } catch (error) {
            console.log(`Il y a eu une erreur pendant le mute: ${error}`);
        }
    },

    name: 'mute',
    description: 'Mute un renard.',
    options: [
        {
            name: 'utilisateur',
            description: `L'utilisateur a mute.`,
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
            required: true
        },
    ],
    permissionsRequired: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.MuteMembers],
};