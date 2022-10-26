import ClientInterface from "./src/interfaces/client.js";
import {
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  NewsChannel,
  TextChannel,
} from "discord.js";


const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on("ready", async () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

(await import("dotenv")).config();

const token = process.env.TOKEN;

(await import("./src/handlers/events.js")).default(client);
(await import("./src/handlers/commands.js")).default(
  client as ClientInterface,
  token as string
);

(await import("./notify.js")).default(client);

// Login the bot
client.login(token);