const fs = require('fs');

module.exports = (client) => {
    const fileNames = fs.readdirSync(process.cwd()+`/bot/events`).filter(file=>file.endsWith(".js"));
    fileNames.forEach(fileName=>{
        try {
            const file = require(`./events/${fileName}`);
            console.warn(`[🎫 EVENT] Loading %s.`,fileName.replace(".js",""));
            if (file.once) {
                if (file.client === true) { 
                    client.once(file.name,(...args)=>file.execute(...args,client));
                } else {
                    client.once(file.name,(...args)=>file.execute(...args));
                }
            } else {
                if (file.client === true) { 
                    client.on(file.name,(...args)=>file.execute(...args,client));
                } else {
                    client.on(file.name,(...args)=>file.execute(...args));
                }
            } 
        } catch(err) { 
            console.warn(`[🎫 EVENT] An error accured while loading the events. Error: %s`,fileName.replace(".js",""));
        }
    });
};