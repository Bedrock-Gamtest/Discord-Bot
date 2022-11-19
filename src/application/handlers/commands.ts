import * as fs from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Collection } from "discord.js";
import * as path from "path";
import {ClientInterface} from "../../resources/all.js";

const { GUILD_ID, CLIENT_ID } = process.env;
const CommandsDir = path.join(process.cwd(), "/src/commands");

export default async (client: ClientInterface, token: string) => {
  const rest = new REST({ version: "9" }).setToken(token);
  const files = fs
    .readdirSync(CommandsDir)
    .filter((name: string) => name.endsWith(".js"));

  client.commands = new Collection();

  for (const file of files) {
    const data: any = (
      await import(path.join(CommandsDir, file))
    ).default.data.toJSON();

    client.commands.set(data.name, {
      fileName:file,
      data:data
    });
  }

  (async () => {
    try {
      console.warn(
        "[⚡ COMMANDS] Reloading %s commands.",
        client.commands.size
      );

      await rest.put(
        Routes.applicationGuildCommands(
          CLIENT_ID as string,
          GUILD_ID as string
        ),
        {
          body: client.commands.map((v) => v.data),
        }
      );

      console.warn(
        "[⚡ COMMANDS] %s have been reloaded.",
        client.commands.size
      );
    } catch (error) {
      console.error(error);
    }
  })();

  client.on("interactionCreate", async (interaction) => {
    const data = (
      await import(
        path.join(
          CommandsDir,
          //@ts-ignore
          client.commands.get(interaction.commandName).fileName
        )
      )
    ).default;
    try {
      data.execute(client, interaction);
    } catch (err) {
      console.warn(err);
    }
  });
};
