const { reactionRoles } = require("../../config.json");

module.exports = {
	name: 'messageReactionAdd',
	once: false,
    client: false,
	async execute(messageReaction,user) {
        try {
            const member = messageReaction.message.guild.members.get.fetch(user.id);
            reactionRoles.forEach(({role_name})=>{
                if (messageReaction.message.emoji.id === role_name) {
                    const role = messageReaction.guild.roles.cache.find(role => role.name === role_name);
                    member.roles.add(role);
                    console.warn('[🥉 ROLE] %s has successfuly been given to %s.',role_name,user.username);
                }
            });
        } catch(err) { 
            console.warn('[🥉 ROLE] An error accured while  giving %s to %s.',role_name,user.username);
        }
    }
};