import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction, EmbedBuilder } from 'discord.js';
import { Colour } from '../interfaces/colour.js';

export default {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong! 🏓'),

    async execute(client: Client, interaction: CommandInteraction) {
        const oldDate = Date.now();

        await interaction.reply({embeds:[
            new EmbedBuilder()
            .setDescription('\`\`\`**PING!**\nWaiting for response...\`\`\`')
            .setColor(Colour.waiting)
        ]});
        await interaction.editReply({embeds:[
            new EmbedBuilder()
            .setDescription(`\`\`\`**PONG! 🏓**\nReponse Time: ${Date.now()-oldDate}ms\`\`\``)
            .setColor(Colour.succes)
        ]});
    }
}