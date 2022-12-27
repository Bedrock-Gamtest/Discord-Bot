import { Client, ClientEvents, Collection, SlashCommandBuilder } from "discord.js"

export interface ClientInterface extends Client {
    commands: Collection<string,{
        fileName:string;
        data:SlashCommandBuilder['toJSON'];
    }>
}
export interface CommandsInterface {
    event: string,
	data: SlashCommandBuilder;
	execute: () => any;
}
export interface EventsInterface {
    event: ClientEvents,
	once: boolean;
	execute: () => any;
}