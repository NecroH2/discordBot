const {
    ApplicationCommandOptionType,
} = require('discord.js');

module.exports = {
      /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
    name: "play",
    description: "Sirve para reproducir una canción",
    options: [
        {
          name: 'song',
          description: 'Song',
          type: ApplicationCommandOptionType.String,
        },
      ],
    callback: async (client, interaction) => {   
        await interaction.deferReply({ ephemeral : true});
        if (interaction.options.get('song')!= null) {
            const song = interaction.options.get('song').value;
            ////comprobaciones previas
            if(!interaction.member.voice?.channel) {
                return interaction.editReply('❌**Tienes que estar en un canal de voz para ejecutar este comando!**');
            }
            if(song.length<5) {
                return interaction.editReply(`❌**Tienes que especificar el nombre de una canción!**`);
            } 
    
            const {member, channel} = interaction;
            client.distube.play(interaction.member.voice?.channel, song, {textChannel: channel, member: member});
            return interaction.editReply(`🔎**Buscando cancion!**`);
        } else {
            return interaction.editReply(`❌**Escribe la wea po oe!**`);
        }
        
    }
}