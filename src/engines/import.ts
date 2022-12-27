import {promises as fs} from 'fs';

const base = './src/engines';

const modules = [];
for (const file of await fs.readdir(base,{withFileTypes:true})) {
    if(file.isFile() && file.name.endsWith('.js') && file.name != 'import.js') modules.push(import(['.',file.name].join('/')).catch(e=>{
        stdout('Importing',file.name, e.stack);
        return {feild: true};
    }));
}
const indexes: Array<(arg:any)=>(void | Promise<void>)> = [];
for (const module of await Promise.all(modules)){
    if(module.feild) continue;
    indexes.push(module.index as (arg?: any)=>void);
}
export function runAll(arg: any){
    const awaitables = [];
    for (const index of indexes) {
        awaitables.push((async ()=>await index(arg))().catch(e=>stdout('Importing','Index', e.stack)));
    }
    return Promise.all(awaitables);
}