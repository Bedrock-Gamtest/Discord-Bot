import { Client, GatewayIntentBits } from "discord.js";
import ClientInteface from "./src/interfaces/client.js";

const client = new Client({ 
  intents:[
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ]
});

client.on("ready", async () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

import("dotenv").then(async (res)=>{
  res.config();
  
  const token = process.env.TOKEN;

  (await import("./src/handlers/events.js")).default(client);
  (await import("./src/handlers/commands.js")).default(client as ClientInteface,token as string);

  // Login the bot
  client.login(token);
});
