import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import ClientInteface from "../../../resources/resources/client.js";
export default {
  data: new SlashCommandBuilder()
    .setName("yt")
    .setDescription("Replies with the YouTube channel link of the current guild owner."),

  async execute(client: ClientInteface, interaction: CommandInteraction) {
    await interaction.reply({
      content: "https://www.youtube.com/c/smellofcurry",
      ephemeral: true,
    });
  },
};
