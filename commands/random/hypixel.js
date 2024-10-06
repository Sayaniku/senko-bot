const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "hypixel",
    description: "Utilitaires + IP pour Hypixel",
    aliases: [],
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    callback: (client, interaction) => {
        interaction.reply(`Voici le materiel **NECESSAIRE** pour aller sur le skyblock de hypixel : https://github.com/SkyblockClient/SkyblockClient
Vous pouvez aussi utiliser badlion ou lunar en 1.8.9 pour le skyblock, en faisant attention a bien prendre l'autre version et non la version pvp.
Cependant pour les joueurs vous pouvez prendre une version normal de badlion ou lunar, peut importe la version
L'ip de hypixel est : play.hypixel.net`)
    }
}