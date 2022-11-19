import { Awaitable, CacheType, Client, ClientEvents, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Application } from "./app.js";


export interface IApplicationCommand{
    name?: string | this['data']['name'];
    description?: string
    data: SlashCommandBuilder,
    execute: (client: Application, interaction: CommandInteraction<CacheType>) => Awaitable<void>
}
export interface IApplicationEvent{
    once?: Boolean
    eventName: keyof ClientEvents;
    execute: (client: Application, interaction: ClientEvents[this['eventName']]) => Awaitable<void>
}