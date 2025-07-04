const calculateLevelXp = require('../../utils/calculateLevelXp');
const levelsDB = require('../../database/levels');
const cooldowns = new Set();

function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = async (client, message) => {
    if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;

    // Vérification config SQLite
    const settings = levelsDB.getSettings(message.guild.id);
    if (!settings.enabled) return;
    if (settings.disabledChannels.includes(message.channel.id)) return;

    const xpToGive = getRandomXp(10, 100);
    let level = levelsDB.getLevel(message.author.id, message.guild.id);

    if (level) {
        let newXp = level.xp + xpToGive;
        let newLevel = level.level;
        const neededXp = calculateLevelXp(newLevel);

        if (newXp >= neededXp) {
            newXp = 0;
            newLevel += 1;

            if (message.author.id === '252128091118239744') {
                message.channel.send(`Bravo mon cher Maitre <@!252128091118239744>, tu as augmenté au niveau **${newLevel}**.`);
            } else {
                message.channel.send(`${message.member.displayName} a atteint le niveau **${newLevel}**.`);
            }
        }
        levelsDB.setLevel(message.author.id, message.guild.id, newXp, newLevel);
    } else {
        levelsDB.createLevel(message.author.id, message.guild.id, xpToGive);
    }

    cooldowns.add(message.author.id);
    setTimeout(() => cooldowns.delete(message.author.id), 60000);
};