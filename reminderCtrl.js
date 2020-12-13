const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.login(process.env.TOKEN);

client.on('ready', () => {
    
	remControl();
    
});


client.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;


 
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
 
   

    if (cmd === `!channel`) {
		console.log(message.channel.id);
        return message.channel.send(message.channel.id);
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
	let subArray = [];
	let deltaTime;
	let message;
	while (true)
	{
		remArray = await database.listReminder();

		for (let element of remArray)
		{
			
			
			
			

			if (deltaTime < 1000 * 60 && deltaTime > 0)
			{
				deltaTime = element.time - new Date();
				console.log(deltaTime);
				let tempEvent = await database.getEvent(element.eventId);
			
				let guild = await client.guilds.fetch(tempEvent.serverId);
			

				let channel = await guild.systemChannel;
				//console.log(channel);
			
				subArray = await database.listSub(tempEvent.id);
				console.log(subArray);
				if (subArray !== null)
				{
					message = "";
					for (let sub of subArray)
					{
						message += `<@${sub.userId}> `;	
					}
				console.log(message);
				message += '\n';
				message += tempEvent.toString();
				message += '\n';

				channel.send(message);
			
				console.log("trigger");
		}

		await timer(60*1000);
	}

}

