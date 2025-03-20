import type { RevoltCommand } from "../interfaces";
import type universalExecutor from "../universalExecutor";
import type { Message } from "revolt.js/dist/maps/Messages";
import { revoltCommands } from "./commands";

export class HelpCommand implements RevoltCommand {
	data = {
		name: "help",
		description: "Show available commands",
	};

	async execute(
		message: Message,
		args: string,
		executor: universalExecutor,
	): Promise<void> {
		let markup = `
### Command reference
Prefix is \`rc!\`
    `;

		for (const command of revoltCommands) {
			markup += `
        **${command.data.name}**
        ${command.data.description}
        ${command.data.usage ? `Usage: \`${command.data.usage}\`\n` : ""}`;
		}

		markup += " >[Source code](https://github.com/mayudev/revcord)";

		message.channel.sendMessage({
			embeds: [
				{
					title: "Revcord",
					description: markup,
					colour: "#7289DA", // british moment
				},
			],
			content: " ",
		});
	}
}
