const Discord = require('discord.js');
const config = require("./config.json");
const client = new Discord.Client();

var express = require("express");

var app = express();

app.get("/", function (request, response){
    response.sendFile(__dirname+"/views/index.html");
});

app.listen(8080);

client.on('ready', () => {
    console.log('I am ready!');
    client.user.setActivity("test"); // "Playing <>" status message for bot
});

client.on("message", async message => {
    // not really sure what these do, don't think they affect enything
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    // prefix is '!' for executing commands (prefix is set in config.json)
    let prefix = config.prefix; 
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let d = new Date();
    let helpArray = ["!ping"," !date"]; // any command we add should be added to this array

    if (cmd === `${prefix}ping`) {
        return message.channel.send("pong");
    }

    /*
    this will just simply print the current date/time with pretty raw formatting. 
    just wanted to see how bots handle outputting variables. 
    be sure to use back ticks (`) when doing this
    */
    if (cmd === `${prefix}date`) {
        return message.channel.send(`${d}`);
    }

    if (cmd === `${prefix}help`) {
        return message.channel.send("Available commands: " + `${helpArray}`);
    }
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = config.prefix; 
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let d = new Date();
    let helpArray = ["!ping"," !date"]; // any command we add should be added to this array

    if (cmd === `${prefix}difFunc`) {
        return message.channel.send(`yes`);
    }
});

// do not touch this. this is how our bot links to our code from discord. 
// the TOKEN variable is set in Heroku so the key is not on GitHub
client.login(process.env.TOKEN);