import { SlashCommandBuilder } from "discord.js";

export default interface CommandsInterface {
    event: string,
	data: SlashCommandBuilder;
	execute: () => any;
}