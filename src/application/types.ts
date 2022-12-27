import { Awaitable, CacheType, Client, ClientEvents, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Application } from "./app.js";
export * from './guildData.js';
export * from './guildManager.js';

export interface IApplicationCommand{
    name?: string | this['data']['name'];
    description?: string
    data: SlashCommandBuilder,
    execute: (client: Application, interaction: CommandInteraction<CacheType>) => Awaitable<void>
}
export interface IApplicationEvent{
    once?: Boolean
    identifier?: Symbol 
    event: keyof ClientEvents;
    execute: (client: Application, ...interactions: ClientEvents[this['event']]) => Awaitable<void>
}