import { SlashCommandBuilder } from "@discordjs/builders";
import type { DiscordCommand } from "../interfaces";
import { Main } from "../Main";
import type universalExecutor from "../universalExecutor";
import { ConnectionError } from "../universalExecutor";
import {
	type CommandInteraction,
	type CacheType,
	PermissionFlagsBits,
} from "discord.js";
import npmlog from "npmlog";

export class AllowBotsCommand implements DiscordCommand {
	data = new SlashCommandBuilder()
		.setName("bots")
		.setDescription(
			"Toggle whether bot messages should be forwarded to Revolt channel",
		);

	async execute(
		interaction: CommandInteraction<CacheType>,
		executor: universalExecutor,
	): Promise<void> {
		// Permission check
		if (interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
			try {
				const target = Main.mappings.find(
					(mapping) => mapping.discord === interaction.channelId,
				);

				if (target) {
					const state = await executor.toggleAllowBots(target);
					await interaction.reply(
						`Forwarding of bot messages has been ${state ? "enabled" : "disabled"}.`,
					);
				} else {
					await interaction.reply("This channel is not connected!");
				}
			} catch (e) {
				if (e instanceof ConnectionError) {
					await interaction.reply(`Error! ${e.message}`);
				} else {
					await interaction.reply("Something went very wrong. Check the logs.");
					npmlog.error("Discord", "An error occurred while toggling bots");
					npmlog.error("Discord", e);
				}
			}
		} else {
			await interaction.reply("Error! You don't have enough permissions.");
		}
	}
}
