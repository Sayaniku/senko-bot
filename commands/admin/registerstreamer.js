const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
} = require('discord.js');
const fs = require('fs');
const path = require('path');

const streamersPath = path.join(__dirname, '../../twitch_streamers.json');

module.exports = {
    name: 'registerstreamer',
    description: 'Enregistre un streamer Twitch à surveiller dans un salon spécifique.',
    options: [
        {
            name: 'pseudo',
            description: 'Pseudo Twitch du streamer',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'salon',
            description: 'Salon où annoncer le live',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: 'roleping',
            description: 'Rôle à ping à chaque live de ce streamer (optionnel)',
            type: ApplicationCommandOptionType.Role,
            required: false,
        },
        {
            name: 'message',
            description: 'Message personnalisé pour ce streamer (optionnel)',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.SendMessages],

    callback: async (client, interaction) => {
        const pseudo = interaction.options.get('pseudo').value.toLowerCase();
        const channel = interaction.options.get('salon').channel;
        const guildId = interaction.guild.id;
        const role = interaction.options.get('roleping')?.role;
        const customMessage = interaction.options.get('message')?.value;

        if (!channel) {
            return await interaction.reply("Salon invalide.");
        }

        let streamers = [];
        if (fs.existsSync(streamersPath)) {
            streamers = JSON.parse(fs.readFileSync(streamersPath));
        }

        if (streamers.some(s => s.pseudo === pseudo && s.guildId === guildId)) {
            return await interaction.reply(`⚠️ Le streamer **${pseudo}** est déjà enregistré sur ce serveur.`);
        }

        const entry = { pseudo, channelId: channel.id, guildId };
        if (role) entry.roleId = role.id;
        if (customMessage) entry.customMessage = customMessage;

        streamers.push(entry);
        fs.writeFileSync(streamersPath, JSON.stringify(streamers, null, 2));

        let replyMsg = `✅ Le streamer **${pseudo}** a été ajouté pour le salon <#${channel.id}> sur ce serveur.`;
        if (role) replyMsg += ` Le rôle <@&${role.id}> sera ping à chaque live.`;
        if (customMessage) replyMsg += ` Un message personnalisé a été défini.`;
        await interaction.reply(replyMsg);
    }
};