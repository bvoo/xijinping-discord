import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, BaseCommandInteraction, Client } from 'discord.js';
import { Command } from 'lib/commands/Command';

class CheckCredit extends Command {
    constructor() {
        const cmd = new SlashCommandBuilder()
            .setName('checkcredit')
            .setDescription('nya')
            .addUserOption(option => 
                option
                    .setName('user')
                    .setDescription('The user')
                    .setRequired(true)
            );

        super(cmd as SlashCommandBuilder);
    }

    async execute(client: Client, interaction: BaseCommandInteraction) {
        let user = interaction.options.get('user', true).value?.toString();
        
        if (user) {
            let userName = client.users.cache.get(user);
            if (userName) {
                console.log(`${interaction.user.username} used ${interaction.commandName} on ${userName.username}`);
            }
        }

        const credit = require('./credit.json');
        if (user) {
            if (!credit[user]) {
                credit[user] = 0;
            }
        }

        let embed = new MessageEmbed()
            .setColor('#2e2e2e')
            .setURL('https://bvoo.xyz/')
            .setTitle('Social Credit Check');
        
        if (user) {
            embed.setDescription(`<@${user}> has ${credit[user]} credits`);
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

export default new CheckCredit();