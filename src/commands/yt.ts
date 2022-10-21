import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import ClientInteface from '../interfaces/client.js';

export default {
    data: new SlashCommandBuilder()
    .setName('yt')
    .setDescription('Replies with my YouTube channel link.'),

    async execute(client:ClientInteface,interaction: CommandInteraction) {

        console.warn(interaction);
        await interaction.reply({content:'https://www.youtube.com/c/smellofcurry', ephemeral: true});
    }
}