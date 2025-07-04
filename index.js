// Configurations of needed packages
require('dotenv').config();
const { Client, Collection, GatewayIntentBits, Partials, ActivityType, Events } = require("discord.js");
const eventHandler = require('./handlers/eventHandler');
const commandlist = require('./handlers/commandlist');
const colors = require("colors");
const mongoose = require("mongoose");
const logEvents = require('./handlers/logEvents/logEvents');  // Importe le fichier principal logEvents

// Always use client with intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User],
    restTimeOffset: 0,
    failIfNotExists: false,
    presence: {
        activities: [{ name: `les renards`, type: ActivityType.Watching }],
        status: "Online"
    },
    allowedMentions: {
        parse: ["roles", "users"],
        repliedUser: false
    }
});

// Connect to the database (optional)
(async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB.');
        eventHandler(client);
        commandlist(client);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();

// Login with the discord token configured in .env file
client.login(process.env.TOKEN);

// Handle message events for logging
client.on('messageCreate', (message) => {
    if (message.content === "senko" || message.content === "Senko") {
        message.reply("Je suis un bot multifonction cree par mon maitre Sayaniku, j'opere generalement dans l'antre des renards et kitsune, cependant vous pouvez me trouver sur 2/3 serveurs en plus car mon maitre a decide de m'ajouter sur ces serveurs, j'ai ete dev en meme temps que ce dernier joue a Honkai Star Rail donc il se peut que de temps a autre mon code ait des problemes");
    }
});
client.on('messageCreate', (message) => {
    if (!message.author.bot) {
        logEvents.execute(client, null, message); // Appelle pour un message créé
    }
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    logEvents.execute(client, oldMessage, oldMessage, newMessage); // Appelle pour un message mis à jour
});

client.on('messageDelete', (message) => {
    logEvents.execute(client, message, null); // Appelle pour un message supprimé
});
//client.on('guildMemberUpdate', (oldMember, newMember) => {
//    require('./handlers/logEvents/nicknameChange')(client, oldMember, newMember);
//});

// Anti-crash of the bot
async function errorHandler(error) {
    // Ignore specific errors
    if (error.code == 10062 || error.code == 40060) return;
    console.log(`[ERROR] ${error}`.red);
}

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);

    // Lancement du checker Twitch
    require('./events/twitch/onStream')(client);
});


process.on("unhandledRejection", errorHandler);
process.on("uncaughtException", errorHandler);
