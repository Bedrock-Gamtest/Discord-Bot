import { EmbedBuilder, APIEmbed, JSONEncodable, ColorResolvable } from "discord.js";

export function IEphameralMessageEmbed(title: string, content: string, color?: ColorResolvable, ephameral?: boolean){
    return {embeds:[new EmbedBuilder().setTitle(title).setDescription(content).setColor(color??null)], ephameral: ephameral??false};
}