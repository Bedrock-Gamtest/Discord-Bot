import { CommandInteraction } from "discord.js";

import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';
import { randomUUID } from "crypto";
import ClientInteface from "../interfaces/client.js";

export default {
    data: new SlashCommandBuilder()
    .setName("uuid")
    .setDescription("This command generates UUID's.")
    .addIntegerOption(option=> option.setName('amount') 
     .setMinValue(1) 
     .setMaxValue(25) 
     .setDescription('Amount of uuids') 
     .setRequired(false)
    ),
    async execute(client:ClientInteface,interaction:CommandInteraction) {
        //@ts-ignore
        const count = interaction?.options.getInteger("amount") || 1;
        //@ts-ignore
        const uuid = new Array(count).fill(null).map(()=>randomUUID());

        const embed = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`**UUID's:**\n${uuid.join("\n")}`);
        interaction.reply({embeds:[embed]});
    }
}