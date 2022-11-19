import { Client, EmbedBuilder, NewsChannel } from "discord.js";
import { MongoClient } from "mongodb";
import * as fs from "fs";
import * as path from "path";
import { Colour } from "./src/resources/all.js";

export default (BotClient:Client) => {

//Gametest module update notification.
setInterval(async () => {
    //@ts-ignore
    (await import("child_process")).exec("packages/check.sh");
  
    const client = new MongoClient(process.env.MONGO_URL as string);
  
    await client.connect();
  
    const db = client.db("bot");
    const collection = db.collection("module_versions");
  
    for (const module of [
      "@minecraft/server",
      "@minecraft/server-net",
      "@minecraft/server-ui",
      "@minecraft/server-gametest",
      "@minecraft/server-admin",
    ]) {
      const doc = (await collection
        .findOne({
          module,
        })
        .catch(() => null)) as unknown as {
        module: string;
        version: string;
      };
  
      const data: string = fs
        .readFileSync(
          path.join(process.cwd(), "packages", module.split("/")[1] + ".txt"),
          { encoding: "utf8" }
        )
        .replace(/\n/g, "");
  
      const docData = {
        module,
        version: data,
      };
  
      if (doc) {
        if (doc.version != data) {
          await collection.updateOne(docData, {
            $set: { module },
          });
  
          notify(BotClient, {
            module,
            version: [doc.version, data],
          });
        }
      } else {
        await collection.insertOne(docData);
      }
    }
  
    client.close();
  }, 600000);
}


async function notify(
    client: Client,
    data: {
      module: string;
      version: [string, string];
    }
  ): Promise<void> {
    const channel = (await (
      await client.guilds.fetch(process.env.GUILD_ID as string)
    )?.channels.fetch(process.env.NEWS_CHANNEL as string)) as NewsChannel;
  
    if (channel)
      channel
        .send({
          embeds: [
            new EmbedBuilder()
              .setURL(`https://www.npmjs.com/package/${data.module}`)
              .setColor(Colour.info)
              .setTitle(
                `**${data.module}** has just been updated from version **${data.version[0]}** to **${data.version[1]}**.`
              ),
          ],
        })
        .then((res) => res.crosspost().catch())
        .catch();
  }
  