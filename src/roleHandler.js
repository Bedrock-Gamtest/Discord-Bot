const fs = require("fs");
const { reactionChannel, reactionMessage, reactionRoles } = require('../config.json');

module.exports = async (client) => {
  const message = client.guilds.cache.at(0).channels.cache.get(reactionChannel).messages.cache.get(reactionMessage);
  message.reactions.removeAll();
  reactionRoles.forEach(role=>{
    try {
      message.react(role.reaction_id);
      console.warn('[🥉 ROLE] %s has successfuly been added.',role.role_name);
    } catch(err) { 
      console.warn('[🥉 ROLE] %s has an invalid icon.',role.role_name);
     }
  });
};
