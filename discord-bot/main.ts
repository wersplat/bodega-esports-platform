// discord-bot/main.ts

import 'dotenv/config';
import { Client, GatewayIntentBits, Collection, Interaction, SlashCommandBuilder, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { createLogger, transports, format } from 'winston';
import { registerCommands } from './utils/registerCommands';
import { startScheduler } from './utils/scheduler';

// Extend the Client class to include a commands property
declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>;
  }
}

// Configure Winston logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, ...meta }) => {
      const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
      return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaString}`;
    })
  ),
  transports: [new transports.Console()],
});

// Create Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Dynamically load all command modules
const commandsPath = join(__dirname, 'commands');
for (const file of readdirSync(commandsPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'))) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { default: cmd } = require(join(commandsPath, file));
  client.commands.set(cmd.data.name, cmd);
}

(async () => {
  try {
    // Auto-register slash commands
    await registerCommands();
    logger.info('Slash commands registered.');

    // Login and start scheduler
    client.once('ready', () => {
      logger.info(`Logged in as ${client.user?.tag}`);
      // Start scheduled tasks (Day 5)
      startScheduler(client);
    });

    await client.login(process.env.DISCORD_TOKEN!);
  } catch (err) {
    logger.error('Startup error', err);
    process.exit(1);
  }
})();

// Interaction handler: commands, buttons, modals
client.on('interactionCreate', async (interaction: Interaction) => {
  try {
    // Slash commands
    if (interaction.isChatInputCommand()) {
      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) return;
      await cmd.execute(interaction);
    }

    // Button interactions (Day 6)
    else if (interaction.isButton()) {
      const [action, id] = interaction.customId.split('_');
      if (action === 'approve') {
        await interaction.update({ content: `✅ Submission ${id} approved.`, embeds: [], components: [] });
        // TODO: notify backend of approval
      } else if (action === 'reject') {
        await interaction.update({ content: `❌ Submission ${id} rejected.`, embeds: [], components: [] });
        // TODO: notify backend of rejection
      }
    }

    // Modal submissions (Day 6)
    else if (interaction.isModalSubmit()) {
      if (interaction.customId === 'broadcastModal') {
        const channelId = interaction.fields.getTextInputValue('channel');
        const message = interaction.fields.getTextInputValue('message');
        const channel = await client.channels.fetch(channelId);
        await (channel as any).send(`📢 ${message}`);
        await interaction.reply({ content: '✅ Broadcast sent.', ephemeral: true });
      }
    }
  } catch (err) {
    logger.error('Interaction handling error', err);
    if (interaction.isRepliable()) {
      await interaction.reply({ content: '❌ There was an error handling your request.', ephemeral: true });
    }
  }
});

// Handle uncaught promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});
