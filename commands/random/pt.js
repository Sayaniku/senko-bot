const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "pete",
    description: "C'est encore pete",
    aliases: ["pt"],
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    callback: (client, interaction) => {
        interaction.reply(`https://tenor.com/view/vilebrequin-vilebrequin-cpt-vilebrequin-c-est-encore-p%C3%A9t%C3%A9-vilebrequin-c-est-pas-sorcier-vilebrequin-p%C3%A9t%C3%A9-gif-19692056`).catch(() => {});
    }
}