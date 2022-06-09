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
        const d = Date.now()
        await interaction.reply({content:'**PING!**\nWaiting for response..'});
        await interaction.editReply({content:`**PONG!**\nReponse Time: ${Date.now()-d}ms`})
      
    }
}