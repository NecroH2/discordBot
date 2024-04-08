const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const buttons = [
  {
    id:'1',
    label : "Anterior"
  },
  {
    id:'2',
    label: "Stop"
  },
  {
    id:'3',
    label: "Siguiente"
  }
]

module.exports = async (client) => {
  console.log(`${client.user.tag} is online.`);
  //try {
  //  const channel = await client.channels.cache.get('1129139413021118485');
  //  if (!channel) return;
  //  
  //  const row = new ActionRowBuilder();
  //  buttons.forEach((button) => {
  //    row.components.push(new ButtonBuilder().setCustomId(button.id).setLabel(button.label)
  //    .setStyle(ButtonStyle.Primary));
  //  });
//
  //  await channel.send({
  //    content: 'Reproduciendo: ',
  //    components: [row]
  //  })
  //} catch (e) {
  //  console.log(e);
  //}
};
