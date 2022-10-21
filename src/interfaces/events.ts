import { ClientEvents } from "discord.js";

export default interface EventsInterface {
    event: ClientEvents,
	once: boolean;
	execute: () => any;
}