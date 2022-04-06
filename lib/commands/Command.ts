import { SlashCommandBuilder } from '@discordjs/builders';
import { BaseCommandInteraction, Client } from 'discord.js';

export class Command {
  public data: SlashCommandBuilder;

  constructor(builder: SlashCommandBuilder) {
    this.data = builder;
  }

  execute(client: Client, interaction: BaseCommandInteraction) {
    console.error('Command not implemented');
  };
}