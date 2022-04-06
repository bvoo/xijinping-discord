import { Client, Interaction, CommandInteraction } from 'discord.js';
import { Command } from 'lib/commands/Command'
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);

async function registerSlashCommands(commands: Command[]) {
    try {
        console.log('Started refreshing application (/) commands.');

        const commandData = commands.map(x => x.data.toJSON());
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: commandData },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

async function handleCommands(client: Client, commands: Command[], interaction: CommandInteraction) {
    console.log(`Interaction created ${interaction.commandName} by ${interaction.user.username}.`);

    const match = commands.find(x => x.data.name === interaction.commandName);

    if (match) {
        match.execute(client, interaction);
    }
}

async function init() {
    return new Promise(async (resolve, reject) => {
        const client = new Client({ intents: ['GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] });

        const commands: Command[] = [];
        const dir = await fs.promises.readdir('./src/commands');
        const commandFiles = dir.filter(file => file.endsWith('.ts'));

        for (const file of commandFiles) {
            const command: Command = (await import(`./commands/${file}`)).default;
            const data = command.data;
            commands.push(command);
            console.log(`Loaded command: ${data.name} `);
        }

        await registerSlashCommands(commands);

        client.once('ready', () => {
            console.log('Ready!');
        });

        client.on('interactionCreate', async (interaction: Interaction) => {
            if (interaction.isCommand()) {
                await handleCommands(client, commands, interaction);
            }
        });

        client.login(process.env.DISCORD_TOKEN);
    });
}

init().then(() => {
    console.log("bye!")
})
