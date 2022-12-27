import { SlashCommandBuilder } from "@discordjs/builders";
import {
  BaseGuildTextChannel,
  ChannelType,
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  GuildTextBasedChannel,
  PermissionFlagsBits,
} from "discord.js";
import { Application, GuildManager, IGuildDataManager, keys, ReturnGuildManager } from "../../../application/app.js";
import { Colors, FunctionalChannels, IEphameralMessageEmbed } from "../../../resources/all.js";

export default {
  data: new SlashCommandBuilder()
    .setName("log")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDescription(
      "Log mesage to the channel"
    )

    .addStringOption((opt) =>
      opt
        .setName("message")
        .setDescription("Select an function type.").setRequired(true)
    ),
  async execute(client: Application, interaction: CommandInteraction) {
    const {guild} = interaction;
    if(guild === null) return await interaction.reply({content:"This is server command u cant use it in direct messages.", ephemeral:true});
    else{
        const option = (interaction.options as CommandInteractionOptionResolver).getString("message",true);
        await Logger.log(option,"Log from commands");
        await interaction.reply({embeds:[new EmbedBuilder().setColor(Colors.success).setTitle("Log sended to Log Channels").setDescription(`Log has been suscessfully sended.`)]});
    }
  },
};