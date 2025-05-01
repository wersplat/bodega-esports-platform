import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('broadcast')
    .setDescription('Send a message to this channel (admin only)')
    .addStringOption(opt =>
      opt.setName('message')
         .setDescription('The message to broadcast')
         .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: '❌ You need admin permissions.', ephemeral: true });
    }

    const msg = interaction.options.getString('message', true);
    await interaction.reply({ content: '✔️ Broadcast sent!', ephemeral: true });
    await interaction.channel?.send(`📢 **Broadcast:** ${msg}`);
  }
};
