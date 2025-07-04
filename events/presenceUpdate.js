const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../streamers.json');

module.exports = async (client, oldPresence, newPresence) => {
    if (!newPresence || !newPresence.userId) return;

    const userId = newPresence.userId;
    const member = newPresence.member;

    // Vérifie si l'utilisateur commence à streamer
    const isStreaming = newPresence.activities.some(
        activity => activity.type === 1 && activity.name === 'Twitch'
    );

    const wasStreaming = oldPresence?.activities?.some(
        activity => activity.type === 1 && activity.name === 'Twitch'
    );

    // Ne notifie que lorsqu'on commence à streamer
    if (!isStreaming || wasStreaming) return;

    if (!fs.existsSync(filePath)) return;
    const rawData = fs.readFileSync(filePath);
    const streamers = JSON.parse(rawData);

    const streamerData = streamers[userId];
    if (!streamerData) return;

    const guild = client.guilds.cache.get(streamerData.guildId);
    if (!guild) return;

    const channel = guild.channels.cache.get(streamerData.channelId);
    if (!channel) return;

    const twitchUrl = `https://twitch.tv/${streamerData.twitchName}`;

    const embed = {
        title: `${member.displayName} est en live !`,
        description: `[Regarder le stream sur Twitch](${twitchUrl})`,
        color: 0x9146FF,
        timestamp: new Date(),
        footer: { text: `Notification des streams par le Maitre Sayaniku` },
    };

    channel.send({ content: `🔴 ${member}`, embeds: [embed] });
};
