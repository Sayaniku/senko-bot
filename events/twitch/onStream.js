const { getStreamers } = require('../../utils/twitchStreamersManager');
const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
let twitchToken = null;

async function getTwitchToken() {
    if (twitchToken) return twitchToken;
    const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`, { method: 'POST' });
    const data = await res.json();
    twitchToken = data.access_token;
    // Correction ici :
    let timeoutDuration = Math.max(1, Math.min((data.expires_in - 60) * 1000, 2147483647));
    setTimeout(() => { twitchToken = null; }, timeoutDuration);
    return twitchToken;
}

const liveNotified = new Set();

async function checkLive(client) {
    const streamers = getStreamers();
    if (streamers.length === 0) return;
    const token = await getTwitchToken();

    for (const { pseudo, channelId, guildId, roleId, customMessage } of streamers) {
        const url = `https://api.twitch.tv/helix/streams?user_login=${pseudo}`;
        const res = await fetch(url, {
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        if (data.data && data.data.length > 0) {
            if (!liveNotified.has(`${guildId}:${pseudo}`)) {
                liveNotified.add(`${guildId}:${pseudo}`);
                const stream = data.data[0];
                const embed = new EmbedBuilder()
                    .setTitle(`${stream.user_name} est en live !`)
                    .setURL(`https://twitch.tv/${stream.user_name}`)
                    .setDescription(stream.title)
                    .addFields(
                        { name: "Jeu", value: stream.game_name || "Inconnu", inline: true },
                        { name: "Viewers", value: stream.viewer_count.toString(), inline: true }
                    )
                    .setImage(stream.thumbnail_url.replace('{width}', '1280').replace('{height}', '720'))
                    .setColor(0x9146FF)
                    .setTimestamp();

                try {
                    const channel = await client.channels.fetch(channelId);
                    if (channel) {
                        let variables = {
                          '{user.name}': stream.user_name,
                          '{stream.game}': stream.game_name || "Inconnu",
                          '{user.twitch.url}': `https://twitch.tv/${stream.user_name}`
                        };
                        let content = '';
                        if (roleId) content += `<@&${roleId}> `;
                        if (customMessage) {
                            let msg = customMessage;
                            for (const [key, value] of Object.entries(variables)) {
                                msg = msg.replaceAll(key, value);
                            }
                            content += msg;
                        }
                        await channel.send({ content: content.trim(), embeds: [embed] });
                    }
                } catch (err) {
                    console.error(`Erreur en envoyant le live dans le salon ${channelId}:`, err);
                }
            }
        } else {
            liveNotified.delete(`${guildId}:${pseudo}`);
        }
    }
}

module.exports = (client) => {
    setInterval(() => checkLive(client), 5 * 1000);
};
