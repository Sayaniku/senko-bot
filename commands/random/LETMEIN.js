const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "letmein",
    description: "LETMEINNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN",
    aliases: ["pt"],
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    callback: (client, interaction) => {
        interaction.reply(`https://tenor.com/view/let-me-in-kintsu-let-me-in-kinstu-liquid-staking-monad-staking-gif-15293478240314454385`).catch(() => {});
    }
}