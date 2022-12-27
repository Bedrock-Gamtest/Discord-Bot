import { SlashCommandBuilder } from "@discordjs/builders";
import { ChannelType, Client, CommandInteraction, EmbedBuilder, ThreadChannel } from "discord.js";
import { Colors, FunctionalChannels } from "../../../resources/all.js";
import { Application } from "../../../application/app.js";

export default {
  data: new SlashCommandBuilder()
    .setName("close")
    .setDescription("Close current question in forum channel."),

  async execute(client: Application, interaction: CommandInteraction) {
    if(interaction.guildId == null||interaction.channel?.type !== 11) return await interaction.reply({content:"Command can´t be called in DM.",ephemeral: true});
    const guild = client.guildManagers[interaction.guildId];
    if(guild == undefined) return await interaction.reply({content:"Unknow guild please define this channel as question channel",ephemeral: true});
    const channel = interaction.channel as ThreadChannel;
    if(!guild.has(FunctionalChannels.questions) || !guild.hasId(channel.parentId??"")) return await interaction.reply({content:"You can´t call this command in this channel.",ephemeral: true});
    if(guild.get(FunctionalChannels.questions)?.id !== channel.parentId) return await interaction.reply({content:"Parent is unknow",ephemeral: true});
    await interaction.reply({content:`ChannelType: ${channel.type}, ChannelId: ${interaction.channel.name}`,ephemeral: true})
  },
};
