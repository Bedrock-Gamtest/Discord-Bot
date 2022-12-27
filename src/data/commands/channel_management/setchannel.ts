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
import { Application, IGuildDataManager, keys, ReturnGuildManager } from "../../../application/app.js";
import { Colors, FunctionalChannels, IEphameralMessageEmbed } from "../../../resources/all.js";

export default {
  data: new SlashCommandBuilder()
    .setName("setchannel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDescription(
      "Change specific channel functionality."
    )

    .addStringOption((opt) =>
      opt
        .setName("type")
        .setDescription("Select an function type.")
        .addChoices(
          { name: "Show Case", value: "showcase" },
          { name: "Suggestions", value: "suggestions" },
          { name: "Bugs", value: "bugs" },
          { name: "Bot Logging", value: "logchannel" },
          { name: "Best Suggestions", value: "bestsuggestions" }
        )
        .setRequired(true)
    )
    .addChannelOption((opt) =>
      opt.setName("channel").setDescription("Select a Channel.").addChannelTypes(ChannelType.GuildText).addChannelTypes(ChannelType.GuildAnnouncement).setRequired(true)
    ),
  async execute(client: Application, interaction: CommandInteraction) {
    const option = interaction.options as unknown as CommandInteractionOptionResolver, {guildId} = interaction;
    const channelType = option.getString("type") as FunctionalChannels;
    const theChannel = option.getChannel("channel") as GuildTextBasedChannel;
    try {
      if(guildId == null) return await interaction.reply({ephemeral:true,content:"This is server command, you can´t use it in direct messages."});
      const data = client.guildManagers[guildId];
      if(data === undefined) return;
      if(data.hasId(theChannel.id) && data.get(channelType)?.id !== theChannel.id) return await interaction.reply({ephemeral:true,content:"This Channel <#" + theChannel.id +"> is already used with different functional useage."});
      await data.set(channelType,theChannel);
      if(channelType === FunctionalChannels.log) Logger.subscribe(theChannel);
      await interaction.reply(IEphameralMessageEmbed("Functional useage susccessfully added.",`Channel: <#${theChannel.id}> was defined as ${channelType}`,Colors.success));
    } catch (er: any) {
      Logger.error(er.stack + "");
    }
  },
};