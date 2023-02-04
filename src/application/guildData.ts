import { Snowflake } from "discord.js";
import {promises as fs} from "fs";

const base = process.cwd();
export type keys = 'logchannel' | 'suggestions' | 'bugs' | 'showcase' |'bestsuggestions';
export type GuildData = {[key in keys]?: string} & {[key: string]: any};
export type Never<T,not> = T extends not?never:T;
export interface IGuildDataManager{
    [key: keys | string]: GuildData
}
export type ReturnGuildManager = IGuildDataManager & {save(): Promise<ReturnGuildManager>, load(): Promise<ReturnGuildManager>}
export async function CreateGuildDataManager(path: string): Promise<ReturnGuildManager>
{   const n: unknown = (new Proxy(await new GuildDataManager(path).load(),new GuildDataManagerHandler()));
    return n as ReturnGuildManager;
}
export class GuildDataManager{
    private filePath: string
    private data?: any
    constructor(file: string) {
        this.filePath = file;
        this.isLoaded = false;
        this.load();
    }
    isLoaded: boolean;
    async save(){
        await fs.writeFile(base + "\\" + this.filePath, JSON.stringify(this.data??{}), 'utf-8');
        return this;
    }
    async load(){
        try {
            this.data = JSON.parse(await fs.readFile(base + "\\" + this.filePath,'utf-8'));
            if(typeof this.data !== 'object') throw new Error("Must be object format!");
        } catch (er) {
            console.error((er as Error).stack);
            this.data = {};
            await this.save();
        }
        return this;
    }
    get ids(){
        return Object.keys(this.data);
    }
    get(id: string): GuildData | void{
        return this.data?.[id] as GuildData;
    }
    set(id: string, value: any){
        this.data = Object.assign(this.data??{}, {[id]: value});
    }
}
export class GuildDataManagerHandler implements ProxyHandler<GuildDataManager>{
    get(target: GuildDataManager, p: string | keyof GuildDataManager, receiver: any) {
        if(isNaN(Number(p))){
            return target[p as keyof GuildDataManager];
        } else {
            return target.get(p);
        }
    }
    set(target: any, p: string, newValue: any, receiver: any): boolean {
        if(!isNaN(Number(p))){
            target.set(p,newValue);
        } 
        return true;
    }
}