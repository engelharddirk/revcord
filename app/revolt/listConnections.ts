import type { RevoltCommand } from "../interfaces";
import type universalExecutor from "../universalExecutor";
import npmlog from "npmlog";
import type { Message } from "revolt.js/dist/maps/Messages";
import type { SendableEmbed } from "revolt-api";

export class ListConnectionsCommand implements RevoltCommand {
	data = {
		name: "connections",
		description: "Show existing connections",
	};

	async execute(
		message: Message,
		args: string,
		executor: universalExecutor,
	): Promise<void> {
		try {
			const connections = await executor.connections();

			const replyEmbed: SendableEmbed = {
				title: "Connected channels",
				colour: "#5765f2",
			};

			if (connections.length) {
				let desc = "";
				for (const connection of connections) {
					desc += `
\`\`\`
#${connection.revolt} => ${connection.discord}
Bots allowed: ${connection.allowBots ? "yes" : "no"}
\`\`\`
`;
				}

				replyEmbed.description = desc;
			} else {
				replyEmbed.description = "No connections found.";
			}

			await message.reply({
				content: " ",
				embeds: [replyEmbed],
			});
		} catch (e) {
			npmlog.error("Discord", "An error occurred while fetching connections");
			npmlog.error("Discord", e);

			await message.reply("An error happened. Check logs.");
		}
	}
}
