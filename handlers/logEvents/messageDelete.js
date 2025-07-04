const fs = require('fs');
const path = require('path');

module.exports = async (client, message) => {
    // Lire la configuration du fichier logSettings.json
    const logSettingsPath = path.join(__dirname, '../../logSettings.json');
    let logSettings = {};

    try {
        logSettings = JSON.parse(fs.readFileSync(logSettingsPath, 'utf8'));
    } catch (error) {
        console.error("Erreur de lecture du fichier logSettings.json : ", error);
        return;
    }

    if (!message || message.author.bot) return;

    const guildId = message.guild.id;
    const logChannelId = logSettings[guildId];

    if (!logChannelId) return;

    const logMessage = `Message supprimé par ${message.author.tag} (${message.author.id}):\n${message.content}`;
    const logChannel = client.channels.cache.get(logChannelId);
    if (logChannel) {
        logChannel.send({
            content: logMessage,
            allowedMentions: { parse: [] } // empêche toutes les mentions
        });
    }
};
