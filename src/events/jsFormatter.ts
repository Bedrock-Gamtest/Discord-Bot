import { Message, AttachmentBuilder } from "discord.js";
import { Buffer } from "node:buffer";
import axios from "axios";

import formatFile from "../hooks/formatFile.js";
import ClientInteface from "../interfaces/client.js";

const { max_file_size } = process.env;

export default {
  event: "messageCreate",
  once: false,
  async execute(client:ClientInteface,message: Message) {
    const file = message.attachments?.at(0);

    // @ts-ignore
    if (!file || file.name.toLowerCase() != "format_me.js") return;

    if (file.size > (max_file_size as unknown as number))
      return message
        .reply({
          content: "The javascript file is too big to format!",
          // @ts-ignore
          ephemeral: true,
        })
        .then((r) => {
          setTimeout(() => r.delete(), 3000);
        })
        .catch();

    const req = await axios.get(file?.url);
    if (req.status != 200)
      return message.reply(
        "An error occurred, while fetching your file: " + req.statusText
      );

    try {
      const text = await req.data;
      const data = await formatFile(text);

      const bufferData = await Buffer.alloc(data.length, data);
      const attachment = new AttachmentBuilder(bufferData, {
        name: "formatted_file.js",
      });
      message.reply({
        content: "Here's your formatted file:",
        files: [attachment],
        // @ts-ignore
        ephemeral: true,
      });
    } catch (err) {
      console.warn(err);
    }
  },
};
