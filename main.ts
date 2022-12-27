import './src/init/import.js';
import { Application } from './src/application/app.js';
import { commands, events } from './src/data/import.js';
import { TextChannel } from 'discord.js';
import {runAll} from './src/engines/import.js';

const {} = process.env as {[key: string]: string};

const app = new Application();
await app.login();
await app.registryCommand(commands);
app.registryEvent(events);

runAll({app:app});