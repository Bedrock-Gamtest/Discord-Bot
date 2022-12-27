import '../init/import.js';
import {
  Client,
  ClientEvents,
  ClientOptions,
  GatewayIntentBits,
  Interaction,
  REST,
  Routes,
  Snowflake
} from "discord.js";
import { IApplicationCommand, IApplicationEvent, ReturnGuildManager, CreateGuildDataManager, GuildManager } from './types.js';
import {Colors, Emoji, FunctionalChannels} from '../resources/all.js'
export * from './types.js';

const {TOKEN, CLIENT_ID  } = process.env as {TOKEN: string, CLIENT_ID: string};

export class Application extends Client<boolean>{
  get _token(){return (this.token??TOKEN) as string;}
  guildData: ReturnGuildManager;
  guildManagers: {[key: Snowflake]: GuildManager | undefined} = {};

  constructor(token: string = TOKEN, guildsPath: string = 'data.json', options?: ClientOptions){
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
    this.guildData = {} as ReturnGuildManager;
    this.token = token as any;
    this.once('ready',async (client)=>{
      this.log("Info",`Bot has logged in as "${this.user?.tag}"`);
      this.guildData = await CreateGuildDataManager(guildsPath);
      for (const [id, guild] of this.guilds.cache) {
        const guildManager = new GuildManager(this,guild);
        this.log('Guild Manager','New Guild Manager created for "' + guild.name + '"');
        this.guildManagers[id] = guildManager;
        const a = this.guildData[id]??{name: guild.name};
        this.guildData[id] = a;
        if(guildManager.has(FunctionalChannels.log)){
          const logChannel = guildManager.get(FunctionalChannels.log);
          if(logChannel === undefined) continue;
          if(!logChannel.isTextBased()) continue;
          Logger.subscribe(logChannel);
        }
      }
      await this.guildData.save();
      await Logger.success("Bot Client is ready!!!", 'Bot susccessfully logged in');
    });
    this.on('interactionCreate', (interaction)=>this.commandHandler(interaction));
  }
  
  login(token?: string){
    this.log('Info','Logining in with token: ' + (token??this._token));
    return super.login(...[token??this._token]);
  }
  async registryCommand(commands: IApplicationCommand[] | IApplicationCommand){
    const rest = new REST({version: "10"}).setToken(this._token);
    if(!Array.isArray(commands)) commands = [commands];
    for (const command of commands) this.commands.set(command.name??command.data.name,command);
    const rawCmd = {body:[...this.commands.entries()].map(([name,cmd])=>{
      this.log(`Command Register`,`Reuploading command "${name}".`); return cmd.data.toJSON();
    })};
    await rest.put(Routes.applicationCommands(CLIENT_ID),rawCmd);

    for (const [guildId,guild] of this.guilds.cache) {
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID,guildId),{body:[]});
      /*for(const [cmdId, cmd] of guild.commands.cache){
        this.log("Command Register","Removing: " + (await guild.commands.delete(cmd).catch(e=>Logger.error(e.stack)))?.name);
      }*/
    }
  }
  private async commandHandler(interaction: Interaction): Promise<void>{
    if(!interaction.isCommand()) return;
    try {
      const {commandName} = interaction;
      this.log('Command Handler', `Executing: "${commandName}"`);
      if(!this.commands.has(commandName)){
        console.log([...this.commands.entries()].map(([k,v])=>k));
        let error = new Error(`No Executor for command "${commandName}", command can be deprecated.`);
        await Logger.error(`Executed by: ${interaction.user.tag}\nCommand Name: ${interaction.commandName}\n` + (error as Error).stack,"The command failed to run ");
        await interaction.reply({content:'***The command failed to run!***\n```\n' + error.stack + '```'});
        return;
      }
      const command = this.commands.get(commandName) as IApplicationCommand;
      await command.execute(this,interaction);
    } catch (error) {
      await Logger.error(`Executed by: ${interaction.user.tag}\nCommand Name: ${interaction.commandName}\n` + (error as Error).stack,"The command failed to run ");
      await interaction.channel?.send({content: Emoji.error + '   ***The command failed to run***'});
    }
  }
  registryEvent(events: IApplicationEvent[] | IApplicationEvent){
    if(!Array.isArray(events)) events = [events];
    for (const ev of events) {
      if(!ev.identifier) ev.identifier = Symbol('New Identifier');
      this.events.set(ev.identifier,ev);
      if(ev.once??false) this.once(ev.event,(...eventData)=>{this.eventHandler(ev.event, ev, eventData)});
      this.on(ev.event,(...eventData)=>this.eventHandler(ev.event,ev,eventData));
      this.log("Event Register",`Event "${ev.event}" was susscefully subscribed. Once: ${ev.once??false}`);
    }
  }
  private async eventHandler<T extends keyof ClientEvents>(eventName: T,executor: IApplicationEvent , eventData: ClientEvents[T]){
    try {
      await executor.execute(this,...eventData);
    } catch (error) {
      await Logger.error('***The command failed to run!***\n```\n' + error + '\n' + (error as {stack?:string}).stack + '```');
    }
  }
  commands = new Map<string, IApplicationCommand>();
  events = new Map<Symbol, IApplicationEvent>();
  log(...params: any[]){
    stdout("Application", ...params);
  }
}