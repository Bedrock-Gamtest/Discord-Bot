import { ColorResolvable, EmbedBuilder, GuildTextBasedChannel, TextBasedChannel } from "discord.js";
import { Colors, Emoji } from "../resources/all.js";

export class ApplicationLogger{
    channels = new Map<string,GuildTextBasedChannel>();
    subscribe(logChannel: GuildTextBasedChannel){
        this.channels.set(logChannel.id,logChannel);
    }
    unsubscribe(id: string){
        this.channels.delete(id);
    }
    private async sendLog(content: string, title?: string, color?: ColorResolvable, emoji: Emoji | string = "", code: string = ""){
        const promises = [];
        const message = {embeds:[new EmbedBuilder().setDescription(codeBlock(content,code)).setTitle((emoji??"") + "  " + (title??"") + " *<t:" + ~~(Date.now()/1000) + ":f>*").setColor(color??null)]};
        for (const [id,channel] of this.channels.entries()) {
            promises.push(channel.send(message).catch(e=>id));
        }
        for (const messageResults of await Promise.all(promises)){
            if(typeof messageResults === 'string') this.channels.delete(messageResults);
        }
        print(...['Logger',title??undefined,content]);
    }
    log(content: string, title?: string){
        return this.sendLog(content,title,Colors.log,Emoji.log);
    }
    info(content: string, title?: string){
        return this.sendLog(content,title,Colors.info,Emoji.info);
    }
    error(content: string, title?: string){
        return this.sendLog(content,title,Colors.error,Emoji.error);
    }
    success(content: string, title?: string){
        return this.sendLog(content,title,Colors.success,Emoji.success);
    }
    warning(content: string, title?: string){
        return this.sendLog(content,title,Colors.warning,Emoji.warning);
    }
}
function codeBlock(content: any, code: string = ""){
    return "```" + code + "\n" + content + "\n```";
}
function print(...params: any[]){console.log(params.filter(a=>a!=undefined).join(" > "))}
export const Logger = new ApplicationLogger();
export default Logger;
declare global{
    var stdout: typeof print;
    var Logger: ApplicationLogger;
}
global.Logger = Logger;
global.stdout = print;