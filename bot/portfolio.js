const { MessageEmbed, MessageAttachment } = require('discord.js')
const { Buffer } = require('node:buffer');
const { default: fetch } = require('node-fetch-commonjs');
const { orginization, portfolio, repository } = require('../config.json');
const Database = require("@replit/database");
const db = new Database()

async function betterFetch(url=null,headers={
  "method":"GET"
}) {
  return fetch(url,{headers})
  .catch()
}

function updatePortfolio(client) {
  console.log("[!] Reloading portfolio...");
  try {
    db.get("_portfolio")
      .then(dbData=>{
      client.channels.fetch(portfolio).then(async (channel)=>{
        await db.set("_portfolio_reload",true);
        let oldThreads = await db.get("_portfolio_threads");
        if (oldThreads && oldThreads[0]) await oldThreads.forEach(async (id)=>{
            // console.log(id)
           const res = await channel.threads.cache.get(id);
           if (res) res.delete().catch(console.error)
        });

        oldThreads = [];

        for (const k of Object.keys(dbData.data)) {
          // console.log(k)
          await channel.threads
            .create({
              name: k,
              autoArchiveDuration: 'MAX'
            })
            .then(async (thread)=>{
              oldThreads.push(thread.id)
              const _message = await betterFetch(dbData.data[k].message), message = await _message.text()
              const _jsc = await betterFetch(dbData.data[k].javascript), jsc = await _jsc.text()
              const jsf = new MessageAttachment(Buffer.alloc(jsc.length,jsc),k+".js");
              const embed = new MessageEmbed()
                .setDescription(`\u200b${message}`)
                .setColor("#2767c2");
              
              await thread.send({embeds: message.trim().length == 0 ? []:[embed],files:[jsf]}).catch()
            })
            .catch();
        }
        await channel.messages.fetch()
        .then(messages => {
          messages.each(message => message.delete().catch())
        })
        await db.delete("_portfolio_threads")
        await db.set("_portfolio_threads",oldThreads)
        console.log("[!] Portfolio has been reloaded.")

        let fields = []; 
        for (var index=0;index<oldThreads.length; ++index) { 
          fields.push(`<#${oldThreads[index]}>` ); 
        };
        const threadEmbed = new MessageEmbed()
          .setColor("#2767c2")
          .setDescription(`Listed below are __our__ open source **GameTest Scripts**. Separated into their own threads, so you can easily find the scripts your looking for.\n~\n\n **${fields.join("**\n **")}**`);
        await channel.send({embeds:[threadEmbed]}).catch()
        await db.delete("_portfolio_reload")
        await db.set("_portfolio_reload",false)
      }).catch(console.error); 
    }).catch(console.error);
  } catch(err){ console.log(err) };
}

module.exports = async function (client,reload=false) {      
  if (reload) return await updatePortfolio(client);
  setInterval(async ()=>{
    let dbData = await db.get("_portfolio");
    if (!Array.isArray(dbData.fetchedCommits)) dbData = {
      fetchedCommits:[],
      data: {}
    };  

    let update = false;

    const _data = await betterFetch("https://api.github.com/users/"+orginization+"/received_events"), data = await _data.json();
  
    if (Object.entries(data).length === 2) return console.log("DATA: "+JSON.stringify(data));
  
    for (const v of data) {
      if (v.repo.name.split(/\//g)[1].toLowerCase() !== repository.toLowerCase() || dbData.fetchedCommits?.includes(v.id)) continue;
      
      console.log("ID: "+v.id)
      dbData.fetchedCommits.push(v.id);
      update = true;
      
      try {
      for (const u of [...v.payload.commits]) {
        const __data = await betterFetch(u.url), ___data = await __data.json();
        
          for (const l of ___data.files) {
            const args = l.filename.split(/\//g);
            if (args[1].match(/\.(\w+)$/g)) continue;
            
            const folder = args[1], file = args[2]
            if (!dbData.data[folder]) dbData.data[folder] = {
              message:null,
              javascript:null
            }
            
              if (file.endsWith(".md")) dbData.data[folder]['message'] = l.raw_url;
              if (file.endsWith(".js")) dbData.data[folder]["javascript"] = l.raw_url;             
          }

        }
      } catch(err) { console.warn(err) }
    }

    await db.delete("_portfolio")  
    await db.set("_portfolio",dbData)
    const reload = await db.get("_portfolio_reload")
    if (update && !reload) updatePortfolio(client)
  },600000) 
}