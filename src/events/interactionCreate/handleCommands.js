const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
  if (interaction.isChatInputCommand()) {
    const localCommands = getLocalCommands();

    try {
      const commandObject = localCommands.find(
        (cmd) => cmd.name === interaction.commandName
      );
  
      if (!commandObject) return;
  
      if (commandObject.devOnly) {
        if (!devs.includes(interaction.member.id)) {
          interaction.reply({
            content: 'Only developers are allowed to run this command.',
            ephemeral: true,
          });
          return;
        }
      }
  
      if (commandObject.testOnly) {
        if (!(interaction.guild.id === testServer)) {
          interaction.reply({
            content: 'This command cannot be ran here.',
            ephemeral: true,
          });
          return;
        }
      }
  
      if (commandObject.permissionsRequired?.length) {
        for (const permission of commandObject.permissionsRequired) {
          if (!interaction.member.permissions.has(permission)) {
            interaction.reply({
              content: 'Not enough permissions.',
              ephemeral: true,
            });
            return;
          }
        }
      }
  
      if (commandObject.botPermissions?.length) {
        for (const permission of commandObject.botPermissions) {
          const bot = interaction.guild.members.me;
  
          if (!bot.permissions.has(permission)) {
            interaction.reply({
              content: "I don't have enough permissions.",
              ephemeral: true,
            });
            return;
          }
        }
      }
  
      await commandObject.callback(client, interaction);
  
    } catch (error) {
      console.log(`There was an error running this command: ${error}`);
    }
  } else {
    if (interaction.isButton()) {
      await interaction.deferReply({ ephemeral: true });
  
      var customId = interaction.customId;
      const queue = client.distube.getQueue(interaction);
      if (queue) {
        var cantidad = queue.songs.length ;
        if (customId=='1'){
          await queue.previous();
          return interaction.editReply(`${client.emotes.back} **Patras**`);
        }
        if (customId=='2'){
          if (queue.playing) {
            await queue.pause();
            return interaction.editReply(`${client.emotes.pause} **Se pausa**`);
          } else {
            await queue.resume();
            return interaction.editReply(`${client.emotes.play} **Se reanuda**`);
          }
        }
        if (customId=='3'){
          if (cantidad>1){
            await queue.skip();
          } else {
            queue.stop();
          }
          return interaction.editReply(`${client.emotes.skip} **Se va palante**`);
        } else {
          return interaction.editReply(`${client.emotes.error} **Algo salio mal con los botones**`);
        }
      } else {
        return interaction.editReply(`${client.emotes.error} **No hay nada en la cola**`);
      }
    }
  }
};
