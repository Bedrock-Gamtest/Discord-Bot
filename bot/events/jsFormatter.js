const { MessageAttachment } = require('discord.js')
const { Buffer } = require("node:buffer");
const { default: fetch } = require('node-fetch-commonjs');
const { format } = require('prettier');

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
      const file = message.attachments.first();
    
      if (file?.name.toLowerCase() !== "format_me.js") return;
      if (file.size > 150000000) return message.reply({
        content:"This javascript file is too big to format!",
        ephemeral:true
      })
      .then((r)=>{
        setTimeout(()=>r.delete(),3000)
      }).catch();
    
      const res = await fetch(file?.url);
      if (!res.ok) return message.reply('An error accured while fetching your file: '+res.statusText);
      
      try {
        const text = await res.text();
        const data = await format(text,{ semi:true, parser:'babel' });

        const bufferData = await Buffer.alloc(data.length,data);
        const attachment = new MessageAttachment(bufferData,'formatted_file.js');
        message.reply({content:"Here's your formatted file:",files:[
          attachment
        ]})
      } catch(err) {
        console.log(err)
      }
  }
}