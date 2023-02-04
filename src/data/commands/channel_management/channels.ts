import { SlashCommandBuilder, SlashCommandChannelOption, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import {
  BaseGuildTextChannel,
  ChannelType,
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  Guild,
  GuildTextBasedChannel,
  PermissionFlagsBits,
} from "discord.js";
import { Application, GuildManager, IGuildDataManager, keys, ReturnGuildManager } from "../../../application/app.js";
import { Colors, FunctionalChannels, IEphameralMessageEmbed } from "../../../resources/all.js";

const typeOptions = new SlashCommandStringOption().setName('type').setDescription('Select function type.').setRequired(true).addChoices(
    { name: "Show Case", value: "showcase" },
    { name: "Suggestions", value: "suggestions" },
    { name: "Bugs", value: "bugs" },
    { name: "Bot Logging", value: "logchannel" },
    { name: "Questions", value: "qestions" }
);
const channelOptions = new SlashCommandChannelOption().setName("channel").setDescription("Select a Channel.").setRequired(true)
.addChannelTypes(ChannelType.GuildText)
.addChannelTypes(ChannelType.GuildAnnouncement)
.addChannelTypes(ChannelType.GuildForum)

export default {
  data: new SlashCommandBuilder()
    .setName("channels").setDescription("Set/Remove/Show functional channels")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand(new SlashCommandSubcommandBuilder().setName("list").setDescription("List all setted functional channels."))
    .addSubcommand(new SlashCommandSubcommandBuilder().setName("remove").setDescription("Remove specific functional channel.").addStringOption(typeOptions))
    .addSubcommand(new SlashCommandSubcommandBuilder().setName("set").setDescription("Set specific functional channel.").addStringOption(typeOptions).addChannelOption(channelOptions)),
  async execute(client: Application, interaction: CommandInteraction) {
    const {guild} = interaction;
    if(guild == null) return await interaction.reply({content:"This is server command you can´t use it in DM.", ephemeral:true});
    const subCommand = interaction.options as CommandInteractionOptionResolver, subName = subCommand.getSubcommand(true);
    return await functions[subName](client,interaction,guild,subCommand);
  },
};
const functions: {[key: string]: (client: Application, interaction: CommandInteraction, guild: Guild,options: CommandInteractionOptionResolver)=>Promise<any|void> | any | void} = {
    list: ListChannel,
    remove: ClearChannel,
    set: SetChannel
}
async function ClearChannel(client: Application, interaction: CommandInteraction, guild: Guild, options: CommandInteractionOptionResolver){
    const option = options.getString("type",true) as FunctionalChannels;
    const manager = client.guildManagers[guild.id] as GuildManager;
    const embed = new EmbedBuilder().setColor(Colors.success).setTitle("Functional Channels");
    if(!manager.has(option)) return await interaction.reply({embeds:[embed.setColor(Colors.error).setDescription('Can´t remove not defined value!')], ephemeral:true});
    if(option === FunctionalChannels.log) Logger.unsubscribe(manager.get(option)?.id as string)
    await manager.set(option);
    await interaction.reply({embeds:[embed.setDescription(`Suscessfully removed.`)]});
}
async function ListChannel(client: Application, interaction: CommandInteraction, guild: Guild, options: CommandInteractionOptionResolver) {
    const manager = client.guildManagers[guild.id];
    const embed = new EmbedBuilder().setColor(Colors.info).setTitle("Functional Channels");
    const fields = [];
    for(const key of [FunctionalChannels.showcase,FunctionalChannels.questions,FunctionalChannels.bugs,FunctionalChannels.log,FunctionalChannels.suggestions]){
        const m = manager?.get(key)?.id;
        fields.push({name:`Type: \`${key}\``, value:m!==undefined?`<#${m}>`:'`Undefined`'});
    }
    embed.setFields(fields);
    await interaction.reply({embeds:[embed]});
}
async function SetChannel(client: Application, interaction: CommandInteraction, guild: Guild, options: CommandInteractionOptionResolver) {
    const channelType = options.getString("type") as FunctionalChannels,
    theChannel = options.getChannel("channel") as GuildTextBasedChannel;
    try {
      const data = client.guildManagers[guild.id];
      if(data == undefined) return await interaction.reply({ephemeral:true,content:"Undefined guild id"});;
      if(data.hasId(theChannel.id) && data.get(channelType)?.id !== theChannel.id) return await interaction.reply({ephemeral:true,content:"This Channel <#" + theChannel.id +"> is already used with different functional useage."});
      await data.set(channelType,theChannel);
      if(channelType === FunctionalChannels.log) Logger.subscribe(theChannel);
      await interaction.reply(IEphameralMessageEmbed("Functional useage susccessfully added.",`Channel: <#${theChannel.id}> was defined as ${channelType}`,Colors.success));
    } catch (er: any) {
      Logger.error(er.stack + "");
    }
}