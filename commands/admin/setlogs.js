// set-logs.js
const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
} = require('discord.js');
const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, '../../logSettings.json');

module.exports = {
    name: 'set-logs',
    description: 'Définir le salon de logs de modération.',
    options: [
        {
            name: 'salon',
            description: 'Le salon où envoyer les logs.',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    
    callback: async (client, interaction) => {
        const channel = interaction.options.get('salon').channel;

        if (!channel) {
            return await interaction.reply("Salon invalide.");
        }

        const settings = JSON.parse(fs.readFileSync(settingsPath));
        settings[interaction.guild.id] = channel.id;

        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

        await interaction.reply(`✅ Salon de logs défini sur <#${channel.id}>`);
    }
};
