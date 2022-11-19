import '../init/import.js';
import {
  CacheType,
  Client,
  ClientEvents,
  ClientOptions,
  EmbedBuilder,
  GatewayIntentBits,
  Interaction,
  NewsChannel,
  REST,
  Routes,
  TextChannel,
} from "discord.js";
import { IApplicationCommand, IApplicationEvent} from './types.js';
export { IApplicationCommand, IApplicationEvent} from './types.js';

const {TOKEN, CLIENT_ID, GUILD_ID  } = process.env as {TOKEN: string, CLIENT_ID: string, GUILD_ID: string};
export class Application extends Client<boolean>{
  get _token(){return (this.token??TOKEN) as string;}
  constructor(token: string = TOKEN as string, options?: ClientOptions){
    super(options??{intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
      ],
    });
    this.token = token;
    this.once('ready',()=>console.log(`Logged in as ${this.user?.tag}`));
    this.on('interactionCreate',((interaction: Interaction)=>this.commandHandler(interaction)) as ()=>any);
  }
  login(token?: string){
    console.log('Logining in!');
    return super.login(token??this._token);
  }
  async registryCommand(commands: IApplicationCommand[] | IApplicationCommand, guild?: string){
    const rest = new REST({version: "10"}).setToken(this._token);
    if(!Array.isArray(commands)) commands = [commands];
    for (const command of commands) this.commands.set(command.name??command.data.name,command);
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID,guild??GUILD_ID),{body:[...this.commands.entries()].map(([name,cmd])=>{
      console.log(`Command Register > Reuploading Command "${name}"`); return cmd.data.toJSON();
    })});
  }
  private async commandHandler(interaction: Interaction<CacheType>){
    if(!interaction.isCommand()) return;
    const {commandName} = interaction;
    if(!this.commands.has(commandName)){
      let error = new Error(`No Executor for command "${commandName}", command is deprecated right now.`);
      return await interaction.reply({ephemeral:true,content:'***The command failed to run!***\n```\n' + error + '\n' + error.stack + '```'});
    }
    const command = this.commands.get(commandName) as IApplicationCommand;
    try {
      await command.execute(this,interaction);
    } catch (error) {
      return await interaction.reply({ephemeral:true,content:'***The command failed to run!***\n```\n' + error + '\n' + (error as {stack?:string}).stack + '```'});
    }
  }
  async registryEvent(event: IApplicationEvent[] | IApplicationEvent){

  }
  private async eventHandler<T extends keyof ClientEvents>(eventName: T, eventData: ClientEvents[T] ){
  }
  commands = new Map<string, IApplicationCommand>();
  events = new Map<any, IApplicationEvent>();
}