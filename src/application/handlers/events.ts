import { Client } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import EventsInterface from "../interfaces/events.js";

export default async (client: Client) => {
  const fileNames = fs
    .readdirSync(path.join(process.cwd(), "/src/events"))
    .filter((file) => file.endsWith(".js"));

  for (const fileName of fileNames) {
    console.warn(`[🎫 EVENT] Loading %s.`, fileName.replace(".js", ""));
    try {
      const file: EventsInterface = (await import(`../events/${fileName}`)).default;
      if (file.once) {
        //@ts-ignore
        client.once(file.event, (...args:any) => file.execute(client,...args));
      } else {
        //@ts-ignore
        client.on(file.event, (...args:any) => file.execute(client,...args));
      }
      console.warn(`[🎫 EVENT] %s has been loaded in.`, fileName.replace(".js", ""));
    } catch (err) {
      console.warn(
        `[🎫 EVENT] An error accured while loading the events. Error: %s`,
        fileName.replace(".js", "")
      );
      console.warn(err);
    }
  }
};
