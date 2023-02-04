import { ChannelType } from "discord-api-types/v10";
import { Message, ThreadAutoArchiveDuration } from "discord.js";
import { Application } from "../../application/app.js";
import { FunctionalChannels } from "../../resources/all.js";

const { SHOWCASE_CHANNEL } = process.env;

export default {
  event: "messageCreate",
  once: false,
  async execute(client: Application, message: Message) {
    if (
      message.channelId === client.guildManagers[message.guildId??"-"]?.get(FunctionalChannels.showcase)?.id &&
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

const Functions = {
  [FunctionalChannels.best]: ()=>{},
  [FunctionalChannels.questions]: questions,
  [FunctionalChannels.showcase]: showcase,
  [FunctionalChannels.suggestions]: suggestions
}
async function showcase(app: Application, msg: Message){

}
async function suggestions(app: Application, msg: Message) {
  
}
async function questions(app: Application, msg: Message) {
  
}