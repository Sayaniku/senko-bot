const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    callback: (client, interaction) => {
        interaction.reply(`Mysth est le mignon des Mymysth`)
    },
    name: "mysth",
    description: "Le plus mignon",
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
	dmPermission: true,
    botOwnerOnly: false,
}