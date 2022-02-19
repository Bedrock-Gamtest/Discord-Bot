const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction } =  require('discord.js')

module.exports = {
    name:'ping',
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        interaction.reply('Pong!');
    }
}