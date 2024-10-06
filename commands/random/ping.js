const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Afficher le ping du bot.",
    aliases: [],
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    callback: (client, interaction) => {
        interaction.reply(`🏓 **Mon ping est de :** ${client.ws.ping} ms.`).catch(() => {});
    }
}