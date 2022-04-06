import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, BaseCommandInteraction, Client } from 'discord.js';
import { Command } from 'lib/commands/Command';

class SocialCredit extends Command {
    constructor() {
        const cmd = new SlashCommandBuilder()
            .setName('socialcredit')
            .setDescription('动态网自由门天安門天安门法輪功李洪志')
            .addStringOption(option =>
                option
                    .setName('mathematics')
                    .setDescription('yeppers')
                    .setRequired(true)
                    .addChoice('add', 'add')
                    .addChoice('remove', 'subtract')
            )
            .addIntegerOption(option =>
                option
                    .setName('number')
                    .setDescription('yeppers')
                    .setRequired(true)
            )
            .addUserOption(option => 
                option
                    .setName('user')
                    .setDescription('The user')
                    .setRequired(true)
            );

        super(cmd as SlashCommandBuilder);
    }

    async execute(client: Client, interaction: BaseCommandInteraction) {
        let mathematics = interaction.options.get('mathematics', true).value?.toString();
        let number = interaction.options.get('number', true) as unknown as any;
        let user = interaction.options.get('user', true).value?.toString();
        
        // check for user in credit.json
        const credit = require('./credit.json');
        if (user && number) {
            if (!credit[user]) {
                credit[user] = 0;
            }

            if (mathematics === 'add') {
                credit[user] += number.value;
            } else if (mathematics === 'subtract') {
                credit[user] -= number.value;
            };
        }

        // save credit.json
        const fs = require('fs');
        fs.writeFile('./src/commands/credit.json', JSON.stringify(credit), (err: any) => {
            if (err) {
                console.error(err);
                return;
            }
        });
        

        let embed = new MessageEmbed()
            .setColor('#2e2e2e')
            .setURL('https://bvoo.xyz/');
        
        if (mathematics === 'add') {
            embed.setTitle('Added ' + number.value + ' credits.');
        } else if (mathematics === 'subtract') {
            embed.setTitle('Subtracted ' + number.value + ' credits.' );
        }
        if (user) {
            embed.setDescription(`<@${user}> now has ${credit[user]} credits`);
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

export default new SocialCredit();