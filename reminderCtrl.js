const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.login(process.env.TOKEN);


client.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;


 
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
 
   

    if (cmd === `!channel`) {
		console.log(channel.id);
        return message.channel.send(channel.id);
    }
});

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
			let tempEvent = await database.getEvent(element.eventId);
			console.log(tempEvent);

			let guild = await client.guilds.fetch(tempEvent.serverId);
			console.log(guild);

			let channel = await client.channels.cache.get('');
			let channel1 = await guild.channels.cache.get('');
			console.log(channel);
			console.log("channel from guild: ", channel);
			//channel.send("@Jack X");

			if (deltaTime < 1000 * 60 && deltaTime > 0)
			{
				console.log("trigger");
			
			}
				

		}

		//TODO: check reminders in database

		await timer(60*1000);
	}

}

remControl();