const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    callback: (client, interaction) => {
        interaction.reply(`On a un beau Nachos qui traverse les dimensions constamment`)
    },
    name: "naos",
    description: "Hola nachos",
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
	dmPermission: true,
    botOwnerOnly: false,
}