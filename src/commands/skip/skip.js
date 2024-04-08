module.exports = {
  name: 'skip',
  description: "Salta la cancion actual",
  callback: async (client, interaction) => {
    await interaction.deferReply();
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.editReply(`❌**No existe nada en la cola!**`)
    var cantidad = queue.songs.length ;
    try {
      if (cantidad>1) {
        const song = await queue.skip()
        return interaction.editReply(`⏩**Saltada! Ahora escuchas:\n${song.name}**`)
      }
      queue.stop();
    } catch (e) {
      interaction.editReply(`❌**No hay mas canciones en la cola**`);
      console.log(e);
    }
  }
}
