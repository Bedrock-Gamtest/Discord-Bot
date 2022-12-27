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
    .setName("listchannels")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDescription(
      "List channels functionalities"
    ),
  async execute(client: Application, interaction: CommandInteraction) {
    const {guild} = interaction;
    if(guild === null) return await interaction.reply({content:"This is server command u cant use it in direct messages.", ephemeral:true});
    else{
        const manager = client.guildManagers[guild.id];
        const embed = new EmbedBuilder().setColor(Colors.info).setTitle("Functional Channels");
        const fields = [];
        for(const key of [FunctionalChannels.showcase,FunctionalChannels.best,FunctionalChannels.bugs,FunctionalChannels.log,FunctionalChannels.suggestions]){
            const m = manager?.get(key)?.id;
            fields.push({name:`Type: \`${key}\``, value:m!==undefined?`<#${m}>`:'`Undefined`'});
        }
        embed.setFields(fields);
        await interaction.reply({embeds:[embed]});
    }
  },
};