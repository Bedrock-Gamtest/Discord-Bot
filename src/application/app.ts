import '../init/import.js';
import {
  CacheType,
  Client,
  ClientEvents,
  ClientOptions,
  EmbedAuthorOptions,
  EmbedBuilder,
  GatewayIntentBits,
  Interaction,
  MessagePayload,
  NewsChannel,
  REST,
  Routes,
  TextChannel,
  ThreadMemberFlagsBitField,
} from "discord.js";
import { IApplicationCommand, IApplicationEvent} from './types.js';
import {Colors} from '../resources/enums.js'
export * from './types.js';



const {TOKEN, CLIENT_ID, GUILD_ID  } = process.env as {TOKEN: string, CLIENT_ID: string, GUILD_ID: string};



export class Application extends Client<boolean>{
  get _token(){return (this.token??TOKEN) as string;}
  logChennel: TextChannel | null = null;


  constructor(token: string = TOKEN, options?: ClientOptions, logChannel?: (client: Application)=>Promise<TextChannel | null>){
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
    this.once('ready',async ()=>{
      console.log(`Logged in as ${this.user?.tag}`);
      if(logChannel!=null){
        const a = await logChannel(this).catch(arr=>console.error(arr,arr.stack));
        if(a == null) return;
        this.logChennel = a;
      }
    });
    this.on('interactionCreate', (interaction)=>this.commandHandler(interaction));
  }
  
  login(token?: string){
    console.log('Logining in with token: ' + (token??this._token));
    return super.login(...[token??this._token]);
  }
  async registryCommand(commands: IApplicationCommand[] | IApplicationCommand, guild?: string){
    const rest = new REST({version: "10"}).setToken(this._token);
    if(!Array.isArray(commands)) commands = [commands];
    for (const command of commands) this.commands.set(command.name??command.data.name,command);
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID,guild??GUILD_ID),{body:[...this.commands.entries()].map(([name,cmd])=>{
      console.log(`Command Register > Reuploading Command "${name}"`); return cmd.data.toJSON();
    })});
  }
  private async commandHandler(interaction: Interaction): Promise<void>{
    if(!interaction.isCommand()) return;
    try {
      const {commandName} = interaction;
      console.log(commandName);
      if(!this.commands.has(commandName)){
        console.log([...this.commands.entries()].map(([k,v])=>k));
        let error = new Error(`No Executor for command "${commandName}", command can be deprecated.`);
        await interaction.reply({ephemeral:true,content:'***The command failed to run!***\n```\n' + error.stack + '```'});
        await this.error('***The command failed to run!***\n```\n' + error + '\n' + (error as {stack?:string}).stack + '```');
        return;
      }
      const command = this.commands.get(commandName) as IApplicationCommand;
      await command.execute(this,interaction);
    } catch (error) {
      await interaction.reply({ephemeral:true,content:'***The command failed to run!***\n```\n' + (error as {stack?:string}).stack + '```'});
      await this.error('***The command failed to run!***\n```\n' + error + '\n' + (error as {stack?:string}).stack + '```');
    }
  }
  registryEvent(events: IApplicationEvent[] | IApplicationEvent){
    if(!Array.isArray(events)) events = [events];
    for (const ev of events) {
      if(!ev.identifier) ev.identifier = Symbol('New Identifier');
      this.events.set(ev.identifier,ev);
      if(ev.once??false) this.once(ev.event,(...eventData)=>{this.eventHandler(ev.event, ev, eventData)});
      this.on(ev.event,(...eventData)=>this.eventHandler(ev.event,ev,eventData));
      console.log(`Event Register > Event "${ev.event}" was susscefully subscribed. Once: ${ev.once??false}`);
    }
  }
  private async eventHandler<T extends keyof ClientEvents>(eventName: T,executor: IApplicationEvent , eventData: ClientEvents[T]){
    try {
      await executor.execute(this,...eventData);
    } catch (error) {
      await this.error('***The command failed to run!***\n```\n' + error + '\n' + (error as {stack?:string}).stack + '```');
    }
  }
  commands = new Map<string, IApplicationCommand>();
  events = new Map<Symbol, IApplicationEvent>();
  async log(any: string){
    if(!this.logChennel) return;
    await this.logChennel.send({embeds:[new EmbedBuilder().setTitle('Logging...').setColor(Colors.log).setDescription(any)]});
  }
  async warn(any: string){
    if(!this.logChennel) return;
    await this.logChennel.send({embeds:[new EmbedBuilder().setTitle('Warning...').setColor(Colors.warning).setDescription(any)]});
  }
  async info(any: string){
    if(!this.logChennel) return;
    await this.logChennel.send({embeds:[new EmbedBuilder().setTitle('Information').setColor(Colors.info).setDescription(any)]});
  }
  async success(any: string){
    if(!this.logChennel) return;
    await this.logChennel.send({embeds:[new EmbedBuilder().setTitle('Succesfull...').setColor(Colors.success).setDescription(any)]});
  }
  async error(any: string){
    if(!this.logChennel) return;
    await this.logChennel.send({embeds:[new EmbedBuilder().setTitle('Error !!!').setColor(Colors.error).setDescription(any)]});
  }
}