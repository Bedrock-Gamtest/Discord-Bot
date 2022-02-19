const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction } =  require('discord.js')
module.exports = {
    name:'yt',
    data: new SlashCommandBuilder()
    .setName('yt')
    .setDescription('Replies with my YouTube channel link.'),
    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        interaction.reply('https://www.youtube.com/c/smellofcurry');
    }
}