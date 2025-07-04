const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require('discord.js');
const canvacord = require('canvacord');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const levelsDB = require('../../database/levels');

canvacord.Font.loadDefault();

module.exports = {
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("Tu ne peux utiliser cette commande que dans un serveur...");
      return;
    }

    await interaction.deferReply();

    const mentionedUserId = interaction.options.get('target-user')?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    const fetchedLevel = levelsDB.getLevel(targetUserId, interaction.guild.id);

    if (!fetchedLevel) {
      interaction.editReply(
        mentionedUserId
          ? `${targetUserObj.user.tag} n'as point assez parlé, décidement, il ne veut point parler`
          : "Tu n'as point assez parlé cher renard, pourquoi ne commencerais-tu pas à parler un peu pour gagner quelques niveaux."
      );
      return;
    }

    const allLevels = levelsDB.getAllLevels(interaction.guild.id);

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

    const rank = new canvacord.RankCardBuilder()
      .setUsername(targetUserObj.user.displayName)
      .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(calculateLevelXp(fetchedLevel.level))
      .setLevel(fetchedLevel.level)
      .setRank(currentRank)
      .setOverlay(90)
      .setBackground('#7f00ff', 'COLOR');

    const data = await rank.build();
    const attachment = new AttachmentBuilder(data, { name: 'level.png' });
    interaction.editReply({ files: [attachment] });
  },

  name: 'level',
  description: "Montre ton niveau ou celui de quelqu'un.",
  options: [
    {
      name: 'target-user',
      description: 'Montre le niveau du renard que tu souhaites.',
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
};