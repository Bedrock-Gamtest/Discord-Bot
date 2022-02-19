const { showcase } = require("../../config.json");

module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message) {
        if (message.channelId!==showcase) return;
        const date = new Date();
        message.react("👍");
        message.react("👎");
        message.startThread({name:`${message.author.username}'s Creation`});
    }
};