const { Client, Intents } = require("discord.js");
const Database = require("@replit/database");
const db = new Database();

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

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  await db.delete("_website");
  await db.set("_website",{icon:client.user.displayAvatarURL({format:'png',size:256,dynamic:true}),name:client.user.username})
  require("./bot/portfolio.js")(client);
});

// require("./bot/roleHandler.js")(client);
require("./bot/slashCommandHandler.js")(client, token);
require("./bot/eventHandler.js")(client);

const keepAlive = require("./server");

keepAlive(); 

db.set("_portfolio_reload",false)

// Login the bot
client.login(token);