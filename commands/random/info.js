const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "info",
    description: "Informations de Senko et du serveur.",
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
    botOwnerOnly: false,

    callback: async (client, interaction) => {
        // Récupère le serveur via son ID
        const guild = client.guilds.cache.get("1117876244147613746");

        // Calcule la durée d'uptime
        const duration = moment.duration(client.uptime).format("\`D\` [jours], \`H\` [h], \`m\` [min], \`s\` [sec]");
        
        // Version de Discord.js
        const discordJSVersion = require("discord.js").version;

        // Crée un embed pour afficher les informations
        const embed = new EmbedBuilder()
            .setColor("#ff796f")
            .setTitle("Informations de Senko et du serveur")
            .setDescription(`Ceci est le bot officiel de l'antre des renards, ce bot est privé et disponible uniquement ici, malgré que le code source soit public.`)
            .setImage('https://i.gyazo.com/fa731c310ce52503885e16fac9ae65c9.jpg')
            .addFields(
                { name: 'Renards :', value: `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toLocaleString('fr-FR')}`, inline: true },
                //{ name: "Commandes présentes :", value: `\`${client.commands.size}\` commandes`, inline: true },
                { name: "📅┆Créé le", value: `<t:${Math.round(client.user.createdTimestamp / 1000)}:f>`, inline: true },
                { name: "🆙┆Uptime", value: `${duration}`, inline: true },
                { name: "🏷┆Node.js Version", value: `\`${process.version}\``, inline: true },
                { name: 'Hébergeur', value: 'Chez <@252128091118239744> - Hetzner DE', inline: true }
            );

        // Envoie l'embed en réponse à la commande
        await interaction.reply({ embeds: [embed] });
    }
};
