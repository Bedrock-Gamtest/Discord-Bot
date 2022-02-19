const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

require("dotenv").config;
const token = process.env.token;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

require("./slashCommandHandler.js")(client, token);

const keepAlive = require("./server");
keepAlive();
// Login the bot
client.login(token);
