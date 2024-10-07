module.exports = {
    name: "ayumi",
    description: "Pas d'insulte envers Ayumi",
    aliases: [],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    testOnly: false,
    callback: (client, interaction) => {
        interaction.reply(`Ayumi n'aime pas les insultes, encore moins a la station Solaire, mais n'aime pas les insultes en general, et ca ne sert a rien d'aller le chercher autre part, il va pas regler le probleme avec vous si vous avez utiliser des insultes, hein <@!1144578003704225972> et <@!688832184974311424>`)
    }
}