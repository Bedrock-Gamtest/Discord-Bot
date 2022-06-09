const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { guild_id, client_id } = require('../config.json');

module.exports = async (client, token) => {
  const rest = new REST({ version: "9" }).setToken(token);
  const names = fs
    .readdirSync(`${process.cwd()}/bot/commands`)
    .filter((name) => name.endsWith(".js"));
  let commands = [];

  names.forEach((name) => {
    const { data } = require(`./commands/${name}`);
    commands.push(data.toJSON());
  });

  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(
        Routes.applicationGuildCommands(
          client_id,
          guild_id
        ),
        { body: commands }
      );

      console.log("Successfully reloaded application (/) commands.");
      commands = [];
    } catch (error) {
      console.error(error);
    }
  })();

  client.on("interactionCreate", (interaction) => {
    const data = require(`./commands/${interaction.commandName}`);
    data.execute(interaction);
  });
};
