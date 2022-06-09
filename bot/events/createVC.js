const { CREATE_VC } = require("../../config.json");

module.exports = {
	name: 'voiceStateUpdate',
	once: false,
    client: false,
	async execute(oldState,newState) {
        const user = await newState.member.user
        const member = newState.member;

        if (newState.channelId !== CREATE_VC) return;

        console.warn("[🎤 VC] Creating VoiceChannel for %s",user.tag);
        try {
            await newState.channel?.parent.createChannel(`${user.tag}'s VC`,{
                type:'GUILD_VOICE'
            }).then(channel=>{
                member.voice.setChannel(channel);
                channel.permissionOverwrites.create(user,{
                    CREATE_INSTANT_INVITE: true,
                    MUTE_MEMBERS: true,
                    DEAFEN_MEMBERS: true,
                    MOVE_MEMBERS: true,
                })
                const interval = setInterval(()=>{
                    const vcMemberCount = channel.members.size;
                    if (vcMemberCount>=1) { return } else {
                        channel.delete();  
                        clearInterval(interval);
                    };
                },5000)
            });
            
            console.warn("[🎤 VC] %s has successfully created a VoiceChannel.",user.tag);
        } catch(err) { return console.warn("[🎤 VC] An error occured while creating a VoiceChannel. Error: %s",err) };
    }
};
