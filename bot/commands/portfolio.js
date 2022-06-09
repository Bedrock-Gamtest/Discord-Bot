const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction, MessageEmbed, Permissions } =  require('discord.js');
const { v4: uuidv4 } = require('uuid');

const Database = require("@replit/database")
const db = new Database()

module.exports = {
    name:'portfolio',
    data: new SlashCommandBuilder()
    .setName("portfolio")
    .addSubcommand(subCommand=>
      subCommand.setName('delete')
      .setDescription('Delete portfolio script.')
      .addStringOption(subCommand=>
      subCommand.setName('script')
      .setDescription('Name of the script you want to delete.')
      ))
    .addSubcommand(subCommand=>
      subCommand.setName('reload')
      .setDescription('Reload portfolio.'))
    .setDescription("Used to manage the portfolio."),
  
    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
      if (!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) || interaction.guild.ownerId !== interaction.member.id) return interaction.reply({content:'You need ADMINISTRATOR Privileges to use this command.',ephemeral:true})
      const dbS = await db.get("_portfolio")
      switch (interaction.options.getSubcommand()) {
        case 'delete':
          deleteScript(interaction,dbS)
          break;
        case 'reload':
          const reload = await db.get("_portfolio_reload")
          if (reload) return interaction.reply({content:'The portfolio is already reloading.',ephemeral:true}).catch();
          await interaction.reply({content:'Reloading Portfolio...',ephemeral:true})
          await require("../portfolio")(interaction.client,true);
          await interaction.editReply({content:"Portfolio has been reloaded.",ephemeral:true}).catch()
          break;
        default:
        interaction.reply({content:"This subcommand hasn't been implemented yet.",ephemeral:true}).catch()
          break;
      }
      
  } 
}

function deleteScript(interaction,dbS) {
  const script = interaction.options?.getString('script') ?? null;
  const keys = Object.keys(dbS.data);
  if (!keys?.includes(script)) return interaction.reply({content:"This script doesn't exist.",ephemeral:true}).catch()
  delete dbS.data[script];
  db.set("_portfolio", dbS)
  .then(()=>{    
    interaction.reply({content:"**"+script+"** has been deleted from the portfolio.",ephemeral:true})
  });
}