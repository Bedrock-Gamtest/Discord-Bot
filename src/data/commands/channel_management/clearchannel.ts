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
    .setName("clearchannels")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDescription(
      "Clear channels functionalities"
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
        ).setRequired(true)
    ),
  async execute(client: Application, interaction: CommandInteraction) {
    const {guild} = interaction;
    if(guild === null) return await interaction.reply({content:"This is server command u cant use it in direct messages.", ephemeral:true});
    else{
        const option = (interaction.options as CommandInteractionOptionResolver).getString("type",true) as FunctionalChannels;
        const manager = client.guildManagers[guild.id] as GuildManager;
        const embed = new EmbedBuilder().setColor(Colors.success).setTitle("Functional Channels");
        if(!manager.has(option)) return await interaction.reply({embeds:[embed.setColor(Colors.error).setDescription('Can´t remove not defined value!')], ephemeral:true});
        if(option === FunctionalChannels.log) Logger.unsubscribe(manager.get(option)?.id as string)
        await manager.set(option);
        await interaction.reply({embeds:[embed.setDescription(`Suscessfully removed.`)]});
    }
  },
};