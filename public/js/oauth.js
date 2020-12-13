
/*
window.onload = loadOAuth();
*/
function loadOAuth() 
{
	console.log(window.location.hash.slice(1));
	const fragment = new URLSearchParams(window.location.hash.slice(1));

	console.log(fragment);

	if (fragment.has("access_token")) {
		const accessToken = fragment.get("access_token");
		const tokenType = fragment.get("token_type");

		fetch('https://discord.com/api/users/@me', {
			headers: {
				authorization: `${tokenType} ${accessToken}`
			}
		})
		.then(res => res.json())
		.then(response => {
			console.log(response);	
		
			//const { username, discriminator } = response;
			//document.getElementById('info').innerText += ` ${username}#${discriminator}`;
		})
		.catch(console.error);

	}
	else {
		console.log("error");
	}
}