import { ChannelType } from "discord-api-types/v10";
import { Message, ThreadAutoArchiveDuration } from "discord.js";
import ClientInteface from "../definitions/resources/client.js";

const { SHOWCASE_CHANNEL } = process.env;

export default {
  event: "messageCreate",
  once: false,
  async execute(client: ClientInteface, message: Message) {
    if (
      message.channelId === SHOWCASE_CHANNEL &&
      message.channel.type === ChannelType.GuildAnnouncement
    ) {

      if (
        !message.attachments.size &&
        !message.content.match(/https?:\/\/.+\.([a-z]+)/gm)
      )
        return message.delete();

      message.react("👍");
      message.react("👎");
      message.startThread({
        name: `${message.author.username}‘s creation`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
      });
      message.crosspost();
    }
  },
};
