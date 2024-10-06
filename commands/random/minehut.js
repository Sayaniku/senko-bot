const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "minehut",
    description: "IP pour les serveurs de minehut",
    aliases: [],
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    callback: (client, interaction) => {
        interaction.reply("L'ip du proxy de clickerfy est : Zyptrik.minehut.gg").catch(() => {});
    },
}