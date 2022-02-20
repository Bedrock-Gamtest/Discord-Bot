const { Client, Intents } = require("discord.js");
const client = new Client({ 
  intents:[
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MEMBERS,
  ]
});

require("dotenv").config;
const token = process.env.token;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

require("./src/roleHandler.js")(client);
require("./src/slashCommandHandler.js")(client, token);
require("./src/eventHandler.js")(client);

const keepAlive = require("./server");

keepAlive();

// Login the bot
client.login(token);