const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require('discord.js');
const levelsDB = require('../../database/levels'); // Adapte ce chemin si besoin

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("Cette commande ne peut être utilisée que dans un serveur.");
      return;
    }

    await interaction.deferReply();

    // Utilise la fonction getAllLevels(guildId)
    const allLevels = levelsDB.getAllLevels(interaction.guild.id);

    if (!allLevels.length) {
      interaction.editReply("Aucune donnée de niveau trouvée pour ce serveur.");
      return;
    }

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    const topUsers = allLevels.slice(0, 10);
    let leaderboard = await Promise.all(topUsers.map(async (entry, index) => {
      try {
        const member = await interaction.guild.members.fetch(entry.userId);
        return `**#${index + 1}** - ${member.displayName} (Niveau ${entry.level}, ${entry.xp} XP)`;
      } catch {
        return `**#${index + 1}** - Utilisateur inconnu (Niveau ${entry.level}, ${entry.xp} XP)`;
      }
    }));

    const embed = new EmbedBuilder()
      .setTitle('🏆 Classement des niveaux')
      .setDescription(leaderboard.join('\n'))
      .setColor('#ffcc00')
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  },

  name: 'leaderboard',
  description: "Affiche le classement des niveaux des renards.",
};