const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
} = require('discord.js');
const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, '../../level_settings.json');

function loadSettings() {
    if (!fs.existsSync(settingsPath)) return {};
    return JSON.parse(fs.readFileSync(settingsPath));
}
function saveSettings(settings) {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

module.exports = {
    name: 'levelsystem',
    description: 'Active ou désactive le système de niveaux sur ce serveur ou certains salons.',
    options: [
        {
            name: 'action',
            description: 'Activer ou désactiver',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'enable', value: 'enable' },
                { name: 'disable', value: 'disable' },
                { name: 'disablechannel', value: 'disablechannel' },
                { name: 'enablechannel', value: 'enablechannel' },
            ],
        },
        {
            name: 'salon',
            description: 'Salon cible (pour désactiver/réactiver sur un salon précis)',
            type: ApplicationCommandOptionType.Channel,
            required: false,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.SendMessages],

    callback: async (client, interaction) => {
        const action = interaction.options.get('action').value;
        const channel = interaction.options.get('salon')?.channel;
        const guildId = interaction.guild.id;

        let settings = loadSettings();
        if (!settings[guildId]) {
            settings[guildId] = { enabled: true, disabledChannels: [] };
        }

        switch (action) {
            case 'enable':
                settings[guildId].enabled = true;
                await interaction.reply("✅ Le système de niveaux a été **activé** sur ce serveur.");
                break;
            case 'disable':
                settings[guildId].enabled = false;
                await interaction.reply("❌ Le système de niveaux a été **désactivé** sur ce serveur.");
                break;
            case 'disablechannel':
                if (!channel) return await interaction.reply("Merci de spécifier un salon.");
                if (!settings[guildId].disabledChannels.includes(channel.id))
                    settings[guildId].disabledChannels.push(channel.id);
                await interaction.reply(`❌ Le système de niveaux est **désactivé** dans <#${channel.id}>.`);
                break;
            case 'enablechannel':
                if (!channel) return await interaction.reply("Merci de spécifier un salon.");
                settings[guildId].disabledChannels = settings[guildId].disabledChannels.filter(id => id !== channel.id);
                await interaction.reply(`✅ Le système de niveaux est **activé** dans <#${channel.id}>.`);
                break;
        }
        saveSettings(settings);
    }
};