import './src/init/import.js';
import { Application } from './src/application/app.js';
import { commands, events } from './src/data/import.js';
import { TextChannel } from 'discord.js';
import notify from './src/engines/notify.js';

const {LOG_CHANNEL, GUILD_ID} = process.env as {[key: string]: string};

const app = new Application();
await app.login();
await app.registryCommand(commands,GUILD_ID);
app.registryEvent(events);
notify(app);

//app.logChennel = await (await app.guilds.fetch(GUILD_ID)).channels.fetch(LOG_CHANNEL) as TextChannel;