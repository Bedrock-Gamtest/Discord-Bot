import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

    async execute(client: Client, interaction: CommandInteraction) {
        const oldDate = Date.now();

        await interaction.reply({content:'**PING!**\nWaiting for response..'});
        await interaction.editReply({content:`**PONG!**\nReponse Time: ${Date.now()-oldDate}ms`})
    }
}