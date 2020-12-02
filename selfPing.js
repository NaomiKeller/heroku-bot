
const ping = require('ping');

// timer function
const timer = ms => new Promise(res => setTimeout(res, ms));

const host = "google.com";	// website

// self ping function
async function selfPing()
{
	while (1)
	{
		await timer(5000);
		console.log("self ping");
		await ping.sys.probe(host, function(isAlive){
			let msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
			
		})
	}

}

selfPing();