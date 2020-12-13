const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.login(process.env.TOKEN);

console.log(client);


client.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;


    let prefix = config.prefix; // prefix is '!'. Set in config.json
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let d = new Date();
    let helpArray = ["!blip", " !site", " !ListEvent", " !event help"]; // List of available commands
    // going to add event command case that includes brief overview of event management commands
    if (cmd === `${prefix}ctrl`) {
        return message.channel.send("ctrl");
    }
}

const { Database, Event, Reminder, Advertisement, Subscription} = require('./database.js');
const database = new Database();


// function timer
const timer = ms => new Promise(res => setTimeout(res, ms));


// reminder control function
async function remControl()
{
	let remArray;
	let deltaTime;

	while (true)
	{
		remArray = await database.listReminder();

		for (let element of remArray)
		{
			deltaTime = element.time - new Date();
			//console.log(deltaTime);
			if (deltaTime < 1000 * 60 && deltaTime > 0)
				console.log("trigger");

		}

		//TODO: check reminders in database

		await timer(60*1000);
	}

}

remControl();