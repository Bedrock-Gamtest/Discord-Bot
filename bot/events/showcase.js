const { showcase } = require("../../config.json");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    if (
      message.channel.id === showcase &&
      message.channel.type === "GUILD_NEWS"
    ) {
      if (
        !message.attachments.size &&
        !message.content.match(/^(https?):\/\/[^\s$.?#].[^\s]*$/gm)
      )
        return message.delete().catch(() => {});
      
      message.react("👍");
      message.react("👎");
      message.startThread({
        name: `${message.author.username}‘s creation`,
        autoArchiveDuration: "MAX",
      });
      message.crosspost();
    }
  },
};
