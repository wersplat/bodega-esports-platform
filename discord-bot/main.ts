// discord-bot/main.ts

import 'dotenv/config';
import { Client, GatewayIntentBits, Collection, Interaction } from 'discord.js';
import { createLogger, transports, format } from 'winston';
import { readdirSync } from 'fs';
import { join } from 'path';
import { registerCommands } from './utils/registerCommands';
import { startScheduler } from './utils/scheduler';
import fetch from 'node-fetch';

// --- Logger Setup ---
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
  ),
  transports: [new transports.Console()],
});

// --- Client Setup ---
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// --- Load Commands ---
const commandsDir = join(__dirname, 'commands');
for (const file of readdirSync(commandsDir).filter(f => f.endsWith('.ts') || f.endsWith('.js'))) {
  const { default: cmd } = require(join(commandsDir, file));
  client.commands.set(cmd.data.name, cmd);
}

(async () => {
  try {
    await registerCommands();
    logger.info('✅ Slash commands registered');

    client.once('ready', () => {
      logger.info(`🤖 Logged in as ${client.user?.tag}`);
      startScheduler(client);
    });

    await client.login(process.env.DISCORD_TOKEN!);
  } catch (err) {
    logger.error('❌ Startup error:', err);
    process.exit(1);
  }
})();

// --- Interaction Handling ---
client.on('interactionCreate', async (interaction: Interaction) => {
  try {
    // Slash Commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction);
    }

    // Buttons
    if (interaction.isButton()) {
      const [action, id] = interaction.customId.split('_');
      if (action === 'approve') {
        await interaction.update({ content: `✅ Submission ${id} approved.`, embeds: [], components: [] });
      } else if (action === 'reject') {
        await interaction.update({ content: `❌ Submission ${id} rejected.`, embeds: [], components: [] });
      }
    }

    // Modals
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'broadcastModal') {
        const channelId = interaction.fields.getTextInputValue('channel');
        const message = interaction.fields.getTextInputValue('message');
        const channel = await client.channels.fetch(channelId);
        await (channel as any).send(`📢 ${message}`);
        await interaction.reply({ content: '✅ Broadcast sent.', ephemeral: true });
      }
    }
  } catch (err) {
    logger.error('❌ Interaction error:', err);
    if (interaction.isRepliable()) {
      await interaction.reply({ content: '⚠️ Error handling your request.', ephemeral: true });
    }
  }
});

// --- Uptime Ping (UptimeRobot) ---
if (process.env.UPTIMEROBOT_HEARTBEAT_URL) {
  setInterval(() => {
    fetch(process.env.UPTIMEROBOT_HEARTBEAT_URL!)
      .then(() => logger.info('📡 UptimeRobot ping sent'))
      .catch(err => logger.warn('⚠️ UptimeRobot ping failed:', err));
  }, 60_000); // every 1 minute
}

// --- Crash Safety ---
process.on('unhandledRejection', err => logger.error('Unhandled Rejection:', err));
process.on('uncaughtException', err => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Extend the Client class to include a commands property
declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>;
  }
}
