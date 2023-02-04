import {promises} from 'fs';
import {IApplicationCommand, IApplicationEvent} from '../application/types.js';

const basePath = "./src/data", cmdPath = 'commands', eventPath = 'events';
export const commands = await Commands();
export const events = await Events();


async function Commands(){
    const coms: IApplicationCommand[] = [];
    for (const category of await promises.readdir([basePath,cmdPath].join('\\'), {withFileTypes:true})) if(category.isDirectory()) for (const file of await promises.readdir([basePath,cmdPath,category.name].join('\\'),{withFileTypes:true})) {
        if(!file.isFile() || !file.name.endsWith('.js')) continue;
        const {default: cmds} = await import(["./",cmdPath,category.name,file.name].join('/')) as {default: IApplicationCommand | IApplicationCommand[]};
        if(Array.isArray(cmds)) coms.concat(cmds);
        else coms.push(cmds);
    }
    return coms;
}
async function Events() {
    const evs: IApplicationEvent[] = [];
    for (const file of await promises.readdir([basePath,eventPath].join('/'),{withFileTypes:true})) if(file.isFile() && file.name.endsWith('.js')) {
        const {default: eve} = await import(["./",eventPath,file.name].join('/')) as {default: IApplicationEvent | IApplicationEvent[]};
        if(Array.isArray(eve)) evs.concat(eve);
        else evs.push(eve);
    }
    return evs;
}