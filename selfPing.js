// function timer
const timer = ms => new Promise(res => setTimeout(res, ms));


// set up http access
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const request = new XMLHttpRequest();

request.open("GET", "https://forgetmebot.herokuapp.com/");
request.responseType = 'text';
request.setRequestHeader('Content-type', 'application/json');
    
request.onload = function() {
        
    console.log(request);
    
};




// selfping (http accessing) function
async function selfPing()
{
	while (1)
	{
		await timer(20*60*1000);		// check once every 20 minutes
		request.send();

	}

}

selfPing();


