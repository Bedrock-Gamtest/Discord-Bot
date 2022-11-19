import { GuildMember, Events } from "discord.js";

import ClientInteface from "../definitions/resources/client.js";

export default {
  event: Events.GuildMemberAdd,
  once: false,
  async execute(client:ClientInteface,member: GuildMember) {
    const role = await member.guild.roles.fetch("944060347826974731");
    if (role) member.roles.add(role);
  },
};
