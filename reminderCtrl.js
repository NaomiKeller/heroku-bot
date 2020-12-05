
// function timer
const timer = ms => new Promise(res => setTimeout(res, ms));


// reminder control function
async function remControl()
{
	while (1)
	{
		await timer(60*1000);
		

		//TODO: check reminders in database
	}

}

remControl();