// Configurations of needed packages
require('dotenv').config();
const { Client, Collection, GatewayIntentBits, Partials, ActivityType, Events } = require("discord.js");
const colors = require("colors")

// Always use client with intents
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User],
    restTimeOffset: 0,
    failIfNotExists: false,
    presence: {
        activities: [{
            name: `les renards`,
            type: ActivityType.Watching
        }],
        status: "Online"
    },
    allowedMentions: {
        parse: ["roles", "users"],
        repliedUser: false
    }
});

// Login with the discord token configured on the .env file
client.login(process.env.TOKEN)

// Say when the bot is ready on the terminal
client.once(Events.ClientReady, readyClient => {
    console.log(`[READY] ${client.user.tag} (${client.user.id}) est prêt | ${client.guilds.cache.size.toLocaleString('fr-FR')} serveurs | ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toLocaleString('fr-FR')} utilisateurs`.green);});

// When an word is say at the start of the phase, the bot replies
client.on('messageCreate', (message) => {
    if (message.author.bot) {
        return;
    }

    if (message.content === "senko") {
        message.reply("Je suis un bot multifonction cree par mon maitre Sayaniku, j'opere generalement dans l'antre des renards et kitsune, cependant vous pouvez me trouver sur 2/3 serveurs en plus car mon maitre a decide de m'ajouter sur ces serveurs, j'ai ete dev en meme temps que ce dernier joue a Honkai Star Rail donc il se peut que de temps a autre mon code ait des problemes");
    }
    if (message.content === "Senko") {
        message.reply("Je suis un bot multifonction cree par mon maitre Sayaniku, j'opere generalement dans l'antre des renards et kitsune, cependant vous pouvez me trouver sur 2/3 serveurs en plus car mon maitre a decide de m'ajouter sur ces serveurs, j'ai ete dev en meme temps que ce dernier joue a Honkai Star Rail donc il se peut que de temps a autre mon code ait des problemes");
    }
});
// Anti-crash of the bot
async function errorHandler(error) {
    // erreurs ignorées
    if (error.code == 10062) return; // Unknown interaction
    if (error.code == 40060) return; // Interaction has already been acknowledged

    console.log(`[ERROR] ${error}`.red);
};
process.on("unhandledRejection", errorHandler);
process.on("uncaughtException", errorHandler);
