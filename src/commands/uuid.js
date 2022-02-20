const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction, MessageEmbed } =  require('discord.js')
module.exports = {
    name:'uuid',
    data: new SlashCommandBuilder()
    .setName('uuid')
    .setDescription('Generates 5 uuid\'s.'),
    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        const uuid = [];
        for (var i=0;i<5;++i) {
            uuid.push(randomUUID({disableEntropyCache:true}));
        };

        const embed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`**UUID's:**\n${uuid.join("\n")}`);
        interaction.reply({embeds:[embed]});
    }
}