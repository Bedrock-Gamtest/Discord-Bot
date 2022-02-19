const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const { token } = require("./settings.json");


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

require('./slashCommandHandler.js')(client,token);

client.login(token);
