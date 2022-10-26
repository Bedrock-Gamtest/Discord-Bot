import { CommandInteraction } from "discord.js";

import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';
import { randomUUID } from "crypto";
import ClientInteface from "../interfaces/client.js";
import { Colour } from "../interfaces/colour.js";

export default {
    data: new SlashCommandBuilder()
    .setName("uuid")
    .setDescription("Generate UUID's.")
    .addIntegerOption(option=> option.setName('amount') 
     .setMinValue(1) 
     .setMaxValue(25) 
     .setDescription('Amount') 
     .setRequired(false)
    ),
    async execute(client:ClientInteface,interaction:CommandInteraction) {
        //@ts-ignore
        const count = interaction?.options.getInteger("amount") || 1;
        //@ts-ignore
        const uuid = new Array(count).fill(null).map(()=>randomUUID());

        const embed = new EmbedBuilder()
        .setAuthor({
            name: client.user?.username as string,
            url: client.user?.avatarURL() as unknown as string,
          })
        .setColor(Colour.default)
        .setDescription(`**UUID${uuid.length > 1 ? "'s":""}:**\n${uuid.join("\n")}`);
        interaction.reply({embeds:[embed]});
    }
}