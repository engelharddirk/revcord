import type UniversalExecutor from "../universalExecutor";
import { ConnectionError } from "../universalExecutor";
import type { Message } from "revolt.js/dist/maps/Messages";
import type { RevoltCommand } from "../interfaces";
import npmlog from "npmlog";
import { Main } from "../Main";

export class AllowBotsCommand implements RevoltCommand {
	data = {
		name: "bots",
		description: "Toggle whether bot messages should be forwarded from Discord",
	};

	async execute(
		message: Message,
		args: string,
		executor: UniversalExecutor,
	): Promise<void> {
		// Permission check
		if (message.channel.server.owner === message.author_id) {
			try {
				const target = Main.mappings.find(
					(mapping) => mapping.revolt === message.channel_id,
				);

				if (target) {
					const state = await executor.toggleAllowBots(target);
					await message.reply(
						`Forwarding of bot messages has been ${state ? "enabled" : "disabled"}.`,
					);
				} else {
					throw new ConnectionError("This channel is not connected!");
				}
			} catch (e) {
				if (e instanceof ConnectionError) {
					await message.reply(`Error! ${e.message}`);
				} else {
					await message.reply("Something went very wrong. Check the logs.");
					npmlog.error("Revolt", "An error occurred while toggling bots");
					npmlog.error("Revolt", e);
				}
			}
		} else {
			await message.reply("Error! You don't have enough permissions.");
		}
	}
}
