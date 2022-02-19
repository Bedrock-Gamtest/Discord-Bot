const { showcase } = require("../../config.json");

module.exports = {
	name: 'messageCreate',
	once: false,
    client: true,
	async execute(client,message) {
        if (message.channelId!==showcase) return;
        const date = new Date();
        message.react("👍");
        message.react("👎");
        message.startThread({name:`${message.author.username}'s Creation ${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getMilliseconds()}`});
    }
};