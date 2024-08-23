require('dotenv').config();
const { Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const {DisTube} = require('distube');
const eventHandler = require('./handlers/eventHandler');
const config = require('../config.json')


const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates
  ],
});

client.distube = new DisTube(client, { 
  emitNewSongOnly: false,
  leaveOnEmpty: true, 
  leaveOnFinish: true,
  leaveOnStop: true,
  savePreviousSongs: true,
  emitAddSongWhenCreatingQueue: false,
  searchSongs: 0, 
  nsfw: false, 
  emptyCooldown: 25,
  ytdlOptions: {
      highWaterMark: 1024* 1024 * 64,
      quality: "highestaudio",
      format: "audioonly",
      liveBuffer: 60000,
      dlChunkSize: 1024* 1024 * 4,
  }
})
client.config = require('../config.json');
client.emotes = config.emoji

const buttons = [
  {
    id:'1',
    label : `${client.emotes.back}`
  },
  {
    id:'2',
    label: `${client.emotes.pausePlay}`
  },
  {
    id:'3',
    label: `${client.emotes.skip}`
  }
]


client.distube
  .on('playSong', async (queue, song) =>{
    const channel = await client.channels.cache.get(queue.textChannel.id);
    if (!channel) return;
  
    const row = new ActionRowBuilder();
    buttons.forEach((button) => {
      row.components.push(new ButtonBuilder().setCustomId(button.id).setLabel(button.label)
      .setStyle(ButtonStyle.Primary));
    });

    await queue.textChannel.send({
      content :`${client.emotes.play} | Reproduciendo \`${song.name}\` - \`${song.formattedDuration}\`\nLa pidió: ${song.user}`,
      components: [row]
    })}
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.success} | Agregada ${song.name} - \`${song.formattedDuration}\` a la cola por ${song.user}`
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | Agregada \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue`
    )
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`${client.emotes.error} | An error encountered: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
  })
  .on('empty', (queue) => {
    queue.textChannel.send('Shaa se fueron todos?! Chao loh vimo...');
  })
  .on('searchNoResult', (message, query) =>
    message.channel.send(`${client.emotes.error} | No se encotró resultado \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('Se acabo!'))

eventHandler(client);


client.login(process.env.TOKEN);
