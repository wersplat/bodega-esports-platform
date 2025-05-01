import 'dotenv/config';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { registerCommands } from './utils/registerCommands';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Dynamically load command modules
const commandsDir = join(__dirname, 'commands');
for (const file of readdirSync(commandsDir).filter(f => f.endsWith('.ts'))) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { default: cmd } = require(join(commandsDir, file));
  client.commands.set(cmd.data.name, cmd);
}

(async () => {
  try {
    // Auto-register slash commands
    await registerCommands();

    // Start the bot
    client.once('ready', () => {
      console.log(`✅ Logged in as ${client.user?.tag}`);
    });
    await client.login(process.env.DISCORD_TOKEN);
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
})();

// Handle interactions
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;
  try {
    await cmd.execute(interaction);
  } catch (err) {
    console.error('❌ Command error:', err);
    await interaction.reply({ content: '❌ There was an error.', ephemeral: true });
  }
});