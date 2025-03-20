import { SlashCommandBuilder } from "@discordjs/builders";
import type { REST } from "@discordjs/rest";
import {
	type RESTPostAPIApplicationCommandsJSONBody,
	Routes,
} from "discord-api-types/v9";
import type { Client } from "discord.js";
import npmlog from "npmlog";

export async function registerSlashCommands(
	rest: REST,
	client: Client,
	guildId: string,
	commandsJson: RESTPostAPIApplicationCommandsJSONBody[],
	// RESTPostAPIApplicationCommandsJSONBody[] awesome
) {
	try {
		await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), {
			body: commandsJson,
		});

		npmlog.info("Discord", "Registered slash commands");
	} catch (e) {
		npmlog.error("Discord", "Couldn't register slash commands");
		npmlog.error("Discord", e);
	}
}
