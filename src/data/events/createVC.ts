// @ts-ignore
import { ChannelType, Client, VoiceChannel, VoiceState } from "discord.js";

const { CREATE_VC } = process.env;

export default {
  event: "voiceStateUpdate",
  once: false,
  execute: async (
    client: Client,
    oldState: VoiceState,
    newState: VoiceState
  ) => {
    //@ts-ignore
    const user = newState.member.user;

    const member = newState.member;

    if (newState.channelId !== CREATE_VC) return;

    console.warn("[🎤 VC] Creating VoiceChannel for %s", user.tag);
    try {
      newState.channel?.parent?.children
        .create({
          type: ChannelType.GuildVoice,
          name: `${user.tag}'s VC`,
        })
        .then((channel: VoiceChannel) => {
          //@ts-ignore
          member.voice.setChannel(channel);
          channel.permissionOverwrites.create(user, {
            CreateInstantInvite: true,
            MuteMembers: true,
            DeafenMembers: true,
            MoveMembers: true,
          });
          const interval = setInterval(() => {
            const vcMemberCount = channel.members.size;
            if (vcMemberCount >= 1) {
              return;
            } else {
              channel.delete();
              clearInterval(interval);
            }
          }, 5000);
        });

      console.warn(
        "[🎤 VC] %s has successfully created a VoiceChannel.",
        user.tag
      );
    } catch (err) {
      return console.warn(
        "[🎤 VC] An error occured while creating a VoiceChannel. Error: %s",
        err
      );
    }
  },
};
