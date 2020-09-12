const Discord = require('discord.js');
const config = require("./config.json");
const client = new Discord.Client();

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

    if (cmd === `${prefix}ping`) {
        return message.channel.send("pong");
    }
});

client.login(process.env.TOKEN);