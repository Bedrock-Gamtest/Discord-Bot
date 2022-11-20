import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Application } from "../../../application/app.js";
export default {
  data: new SlashCommandBuilder()
    .setName("yt")
    .setDescription("Replies with the YouTube channel link of the current guild owner."),
  name: "yt",
  async execute(client: Application, interaction: CommandInteraction) {
    await interaction.reply({
      content: "https://www.youtube.com/c/smellofcurry",
      ephemeral: true,
    });
  },
};
