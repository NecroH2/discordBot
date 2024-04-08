module.exports = {
  name: 'pause',
  description: "Salta la cancion actual",
  callback: async (client, interaction) => {
    await interaction.deferReply();
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.editReply(`❌**No existe nada en la cola!**`)
    if (queue.paused) {
      queue.resume()
      return interaction.editReply('▶️**Se ha puesto en play**')
    }
    queue.pause()
    interaction.editReply('⏸**Se ha pausado la canción**')
  }
}
