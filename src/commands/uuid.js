const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction, MessageEmbed } =  require('discord.js')
module.exports = {
    name:'uuid',
    data: new SlashCommandBuilder()
    .setName("uuid")
    .setDescription("This command generates UUID's.")
    .addIntegerOption(option=> option.setName('amount') 
     .setMinValue(1) 
     .setMaxValue(25) 
     .setDescription('Amount of uuids') 
     .setRequired(false)) 
    .toJSON(),

    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        const count = interaction.options?.getInteger('amount') ?? 1;
        const uuid = [];
        for (var i=0;i<count;++i) {
            uuid.push(randomUUID({disableEntropyCache:true}));
        };

        const embed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`**UUID's:**\n${uuid.join("\n")}`);
        interaction.reply({embeds:[embed]});
    }
}
