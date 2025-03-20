import { SlashCommandBuilder } from "@discordjs/builders";
import type universalExecutor from "app/universalExecutor";
import {
	type CommandInteraction,
	EmbedBuilder,
	PermissionFlagsBits,
} from "discord.js";
import npmlog from "npmlog";
import type { DiscordCommand } from "../interfaces";

export class ListConnectionsCommand implements DiscordCommand {
	data = new SlashCommandBuilder()
		.setName("connections")
		.setDescription("Show existing connections");

	async execute(interaction: CommandInteraction, executor: universalExecutor) {
		// Permission check
		if (interaction.memberPermissions.has(PermissionFlagsBits.ManageChannels)) {
			try {
				const connections = await executor.connections();

				const replyEmbed = new EmbedBuilder()
					.setAuthor({ name: "Revcord" })
					.setColor("#5765f2")
					.setTitle("Connected channels");

				if (connections.length) {
					let desc = "";
					for (const connection of connections) {
						desc += `
\`\`\`#${connection.discord} => ${connection.revolt}
Bots allowed: ${connection.allowBots ? "yes" : "no"}
\`\`\``;
					}

					replyEmbed.setDescription(desc);
				} else {
					replyEmbed.setDescription("No connections found.");
				}

				await interaction.reply({ embeds: [replyEmbed] });
			} catch (e) {
				npmlog.error("Discord", "An error occurred while fetching connections");
				npmlog.error("Discord", e);

				await interaction.reply("An error happened. Check logs.");
			}
		} else {
			await interaction.reply("Error! You don't have enough permissions.");
		}
	}
}
