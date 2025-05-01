import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

export async function registerCommands() {
  const commands: any[] = [];
  const commandsPath = join(__dirname, '../commands');
  for (const file of readdirSync(commandsPath).filter(f => f.endsWith('.ts'))) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { default: cmd } = require(join(commandsPath, file));
    commands.push(cmd.data.toJSON());
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
  const route = process.env.REGISTER_GLOBAL === 'true'
    ? Routes.applicationCommands(process.env.CLIENT_ID!)
    : Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!);

  console.log(`🔄 Registering ${commands.length} commands (${process.env.REGISTER_GLOBAL === 'true' ? 'GLOBAL' : 'GUILD'})…`);
  await rest.put(route, { body: commands });
  console.log('✅ Commands registered successfully.');
}
