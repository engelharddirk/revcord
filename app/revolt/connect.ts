import type { RevoltCommand } from "../interfaces";
import type universalExecutor from "../universalExecutor";
import { ConnectionError } from "../universalExecutor";
import type { Message } from "revolt.js/dist/maps/Messages";
import npmlog from "npmlog";

export class ConnectCommand implements RevoltCommand {
  data = {
    name: "connect",
    description: "Connect this Revolt channel to a specified Discord channel",
    usage: "rc!connect <Discord channel ID or name>",
  };

  async execute(
    message: Message,
    args: string,
    executor: universalExecutor
  ): Promise<void> {
    const target = args;

    if (!args) {
      await message.reply("Error! You didn't provide a channel");
      return;
    }

    // Permission check
    if (message.channel.server.owner === message.author_id) {
      try {
        await executor.connect(target, message.channel_id);
        await message.reply("Channels are now connected!");
      } catch (e) {
        if (e instanceof ConnectionError) {
          await message.reply(`Error! ${e.message}`);
        } else {
          await message.reply("Something went very wrong. Check the logs.");
          npmlog.error("Revolt", "An error occurred while disconnecting channels");
          npmlog.error("Revolt", e);
        }
      }
    } else {
      await message.reply("Error! You don't have enough permissions.");
    }
  }
}
