
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
			console.log(deltaTime);
			if (Math.abs(deltaTime) < 1000 * 60)
				console.log("trigger");

		}

		//TODO: check reminders in database

		await timer(30*1000);
	}

}

remControl();