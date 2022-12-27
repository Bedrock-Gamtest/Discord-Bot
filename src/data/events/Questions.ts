import { GuildMember, Events, Client, ThreadChannel } from "discord.js";
import { Application } from "../../application/app.js";

export default {
  event: Events.ThreadCreate,
  once: false,
  async execute(client: Application, thread: ThreadChannel, newlyCreated: boolean) {
    Logger.log('Thread Created! ' + thread.name + ", NewlyCreated: " + newlyCreated + "\nParent: " + thread.parent?.name);
  },
};
