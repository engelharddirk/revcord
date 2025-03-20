import { SlashCommandBuilder } from "@discordjs/builders";
import type { DiscordCommand } from "../interfaces";
import type UniversalExecutor from "../universalExecutor";
import { ConnectionError } from "../universalExecutor";
import { type CommandInteraction, PermissionFlagsBits } from "discord.js";
import npmlog from "npmlog";

export class DisconnectCommand implements DiscordCommand {
	data = new SlashCommandBuilder()
		.setName("disconnect")
		.setDescription("Disconnect this channel from Revolt");

	async execute(interaction: CommandInteraction, executor: UniversalExecutor) {
		// Permission check
		if (interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
			try {
				await executor.disconnect("discord", interaction.channelId);
				await interaction.reply("Channel disconnected successfully.");
			} catch (e) {
				if (e instanceof ConnectionError) {
					await interaction.reply(`Error! ${e.message}`);
				} else {
					await interaction.reply("Something went very wrong. Check the logs.");
					npmlog.error(
						"Discord",
						"An error occurred while disconnecting channels",
					);
					npmlog.error("Discord", e);
				}
			}
		} else {
			await interaction.reply("Error! You don't have enough permissions.");
		}
	}
}
