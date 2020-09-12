const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
    client.user.setActivity("yeehaw"); // "Playing <>" status message for bot
});

client.on("message", async message => {
    if (message.author.client) return;
    if (message.channel.type === "dm") return;

    let prefix = config.prefix; // prefix is '!' for executing commands
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (cmd === `${prefix}test`) {
        return message.channel.send("hello world");
    }
});

client.login(process.env.TOKEN);