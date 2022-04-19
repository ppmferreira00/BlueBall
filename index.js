const express = require('express');
const opus = require('@discordjs/opus');
const app = express();
app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});
app.listen(process.env.PORT); // Recebe solicitações que o deixa online

const Discord = require("discord.js"); //Conexão com a livraria Discord.js
const client = new Discord.Client(); //Criação de um novo Client
const config = require("./config.json"); //Pegando o prefixo do bot para respostas de comandos

//client.login(process.env.TOKEN); //Ligando o Bot caso ele consiga acessar o token

const mySecret = process.env['TOKEN']
client.login(mySecret);

client.on('message', message => {
     if (message.author.bot) return;
     if (message.channel.type == 'dm') return;
     if (!message.content.toLowerCase().startsWith(config.prefix.toLowerCase())) return;
     if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

    const args = message.content
        .trim().slice(config.prefix.length)
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        const commandFile = require(`./commands/${command}.js`)
        commandFile.run(client, message, args);
    } catch (err) {
    console.error('Erro:' + err);
  }
});
//Status Bot
client.on("ready", () => {
  let activities = [
      `GRUPO TEIRO`
      ],
    i = 0;
  setInterval( () => client.user.setActivity(`${activities[i++ % activities.length]}`, {
        type: "LISTENING"
      }), 1000 * 1); //WATCHING, LISTENING, PLAYING, STREAMING
  client.user
      .setStatus("dnd")
      .catch(console.error);
console.log("Estou Online!")
});


//Olha ele ae
client.on('voiceStateUpdate', (oldState, newState) => {
    if(newState.channelID === null) //left
        console.log('user left channel', oldState.channelID);
    else if(oldState.channelID === null){ // joined
        console.log('user joined channel', newState.channelID);
        const canalAcessado = client.channels.cache.get(newState.channelID);
        canalAcessado.join().then(connection => {
          const dispatcher = connection.play('assets/Olha_ele_ae.mp3');
          dispatcher.on("finish", finish => {
            canalAcessado.leave();
            //console.log('saiu');
            });
        console.log("Successfully connected.");
        }).catch(e => {
        console.error(e);
        });

    }
    else // moved
        console.log('user moved channels', oldState.channelID, newState.channelID);
});
