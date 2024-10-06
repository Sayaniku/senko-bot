const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "wynncraft",
    description: "Utilitaires + IP pour Wynncraft",
    aliases: [],
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    callback: (client, interaction) => {
        interaction.reply(`Voici le materiel **NECESSAIRE** pour aller sur le MMORPG minecraft Wynncraft : 
https://www.curseforge.com/minecraft/search?page=1&pageSize=20&sortBy=relevancy&class=modpacks&search=wynntale
https://modrinth.com/modpacks?q=wyncraft
Vous pouvez aussi dorenavant utiliser lunar et dans la categorie modpack un modpack Wynncraft est disponible
L'ip est la suivante : play.wynncraft.com
Pensez a prendre votre poulet gratuit en route, un coffre est disponible chaque mois en prime : https://store.wynncraft.com/`).catch(() => {});
    }
}