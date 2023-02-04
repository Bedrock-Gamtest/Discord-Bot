import { GuildMember, Events, Client } from "discord.js";


export default {
  event: Events.GuildMemberAdd,
  once: false,
  async execute(client: Client,member: GuildMember) {
    const role = await member.guild.roles.fetch("944060347826974731");
    if (role) member.roles.add(role);
  },
};
