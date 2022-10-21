import { Client, Collection, SlashCommandBuilder } from "discord.js"

export default interface ClientInteface extends Client {
    commands: Collection<string,{
        fileName:string;
        data:SlashCommandBuilder['toJSON'];
    }>
}