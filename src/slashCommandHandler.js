const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

module.exports = async (client, token) => {
  const rest = new REST({ version: "9" }).setToken(token);
  const names = fs
    .readdirSync(`${process.cwd()}/commands`)
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
          "944643730600763454",
          "862462061594017802"
        ),
        { body: commands }
      );

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  })();

  client.on("interactionCreate", (interaction) => {
    const data = require(`./commands/${interaction.commandName}`);
    data.execute(interaction);
  });
};
