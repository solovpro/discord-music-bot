const {token} = require('../config.json');
const {Client, GatewayIntentBits, Partials} = require('discord.js');
const {createAudioPlayer, createAudioResource, AudioPlayerStatus, joinVoiceChannel, NoSubscriberBehavior} = require('@discordjs/voice');
const play = require('play-dl')

// --------------------------------------------------------------------------------- //
// Получение различной информации для работы бота с клиентом //

const client = new Client({
   intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildScheduledEvents,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildInvites,
   ],
   partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.ThreadMember]
});

// --------------------------------------------------------------------------------- //
// Объявление переменных для обработки различных действий //

const prefix = '-';
const servers = {};
let resource = null;
let connectionChannelId = null;
let isConnection = null;
let type = null;


// Ответ бота при подключении к каналу //
client.once('ready', () => {
   console.log('Уже включили античит для фасика😈?');
})

client.on('messageCreate', (message) => {

   // --------------------------------------------------------------------------------- //
   // Различные диалоги с ботом //

   if (message.content.toLowerCase() === 'диванбот, подскажи, кто тебя создал?') {
      return message.reply('Брат, поговаривают это какой-то гений программировния, ребята просто пошутили, а он реально его сделал, вот сумашедший');
   }

   if (message.content.toLowerCase() === 'диванбот, кто гей?') {
      const arr = ['Сережа', 'Степан', 'Алексей', 'Евгений', 'Никто, потому что выпал Диман'];
      return message.reply(arr[Math.floor(Math.random() * arr.length)]);
   }

   if (message.content.toLowerCase() === 'диванбот команды') {
      return message.reply('"-play ссылка" для проигрывания музыки из ютуба\n"-fonk" для проигрывания фонка\n"-morgen" для проигрывания Моргенштерна\n"-stop" закончить проигрывание музыки');
   }

   // --------------------------------------------------------------------------------- //
   // Функции для запуска трека //

   const playFunc = async (connection, message, type, queue) => {
      if (!servers[message.guild.id]) {
         servers[message.guild.id] = {
            queue: []
         }
      }

      let server = servers[message.guild.id];
      server.queue.push(queue);


      if (server.queue[0]) {
         let link = server.queue[0];
         let stream = await play.stream(link)
         let player = createAudioPlayer({
            behaviors: {
               noSubscriber: NoSubscriberBehavior.Play
            }
         })
         let resource = createAudioResource(stream.stream, {
            inputType: stream.type
         })

         await player.play(resource);
         connection.subscribe(player);

         server.queue.shift();

         player.on(AudioPlayerStatus.Playing, () => {
            if (type === 'play') {
               return message.reply(`Ну раз хотите музла, щас нарубим😎`);
            } else if (type === 'fonk') {
               return message.reply('Щас нарублю, парни😎');
            } else if (type === 'morgen') {
               return message.reply('Оаоаоаоаммм... Моргенштерн - топ');
            } else if (type === 'chill') {
               return message.reply('Чииилл🤤');
            }
         });
         player.on('error', (error) => console.error(error));
         player.on(AudioPlayerStatus.Idle, () => {
            connection.disconnect();
         });
      }
   }

   // --------------------------------------------------------------------------------- //
   // Получаем информацию для включения трека //

   let connection = joinVoiceChannel({
      channelId: isConnection ? connectionChannelId : message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
   });

   if (!connectionChannelId) {
      isConnection = true;
      connectionChannelId = message.member.voice.channel.id;
   }

   let args = message.content.substring(prefix.length).split(' ');

   // --------------------------------------------------------------------------------- //
   // Ответы на основные команды //

   switch (args[0]) {
      case 'play': {
         if (!message.member.voice.channel) {
            return message.reply('Сначала зайди в какой-нибудь канал, а потом пиши уже сюда, гений');
         }

         if (!args[1]) {
            return message.reply('Чувак, ссылку-то скинь, я как тебе должен без ссылки воспроизвести аудио, гений');
         }

         playFunc(connection, message, 'play', args[1]);
         break;
      }
      case 'фонк': {
         playFunc(connection, message, 'fonk', 'https://www.youtube.com/watch?v=r_Kp0_AvL48&ab_channel=%D0%9C%D1%83%D0%B7%D1%8B%D0%BA%D0%B0%D0%B4%D0%BB%D1%8F%D0%9A%D0%B0%D1%82%D0%BE%D0%BA');
         break;
      }
      case 'морген': {
         playFunc(connection, message, 'morgen', 'https://www.youtube.com/watch?v=c_I9CrcJHfM');
         break;
      }
      case 'чилл': {
         playFunc(connection, message, 'chill', 'https://www.youtube.com/watch?v=TiK_u2-SQDQ&ab_channel=BRUFTMUSICMIX');
         break;
      }
      case 'скип': {
         break;
      }
      case 'ухади': {
         message.reply('На сиводня с музыкай все').then(() => {
            connection.destroy();
            return;
         });
         break;
      }
      default: {
         break;
      }
   }
})

// Включение бота //
client.login(token);
