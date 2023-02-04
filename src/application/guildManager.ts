import { Guild, GuildBasedChannel, GuildTextBasedChannel } from "discord.js";
import { Application } from "./app.js";
import { FunctionalChannels } from "../resources/all.js";

export class GuildManager{
    guild: Guild;
    app: Application
    get data(){
        return this.guildData[this.guild.id];
    }
    get guildData(){
        return this.app.guildData;
    }
    constructor(app: Application,guild: Guild){
        this.app = app;
        this.guild = guild;
    }
    async set(type: FunctionalChannels, channel?: GuildBasedChannel){
        if(channel === undefined){
            delete this.data[type];
        } else {
            this.data[type] = channel.id;
        }
        await this.guildData.save();
    }
    get(type: FunctionalChannels): GuildBasedChannel | undefined{
        const a = this.data[type];
        if(a === undefined) return undefined;
        else{
            return this.guild.channels.cache.get(a);
        }
    }
    has(type: FunctionalChannels): boolean{
        return type in this.data;
    }
    hasId(id: string): FunctionalChannels | undefined{
        for (const [fType,fId] of this.keys()) {
            if(id === fId) return fType;
        }
    }
    keys(): [FunctionalChannels,string][]{
        const dt = this.data;
        return Object.getOwnPropertyNames(dt).filter(a=>!isNaN(Number(dt[a]))).map((a)=>[a as FunctionalChannels,dt[a]]);
    }
}