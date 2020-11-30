
// function timer
const timer = ms => new Promise(res => setTimeout(res, ms));


// reminder control function
async function remControl()
{
	while (1)
	{
		await timer(5000);
		console.log("reminder control looping");

		//TODO: check reminders in database
	}

}

remControl();