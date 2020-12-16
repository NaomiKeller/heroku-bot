const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;

////////////////////////

const { Database, Event, Reminder, Advertisement, Subscription} = require('./database.js');
const database = new Database();

const serverId = '750766901306589309';

////////////////////////

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));

console.log(__dirname);

// NAVIGATION 

router.get('/', (req, res) => {
	res.sendFile('/index.html'); // login path.join(__dirname+
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname+'/public/home.html')); // dashboard
});

app.get('/cal', (req, res) => {
  res.sendFile(path.join(__dirname+'/public/cal.html'));
});

app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname+'/public/create.html'));
});

app.get('/edit', (req, res) => {
  res.sendFile(path.join(__dirname+'/public/edit.html'));
});

app.get('/delete', (req, res) => {
  res.sendFile(path.join(__dirname+'/public/delete.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname+'/public/contact.html'));
});

app.get('/help', (req, res) => {
  res.sendFile(path.join(__dirname+'/public/help.html'));
});

// posts

// this new post is to check username & password 
app.post('/', (req, res) => {
	
	console.log(req.body);
	
	if (req.body.username === "admin" && req.body.password === "pass")	
	{
		console.log("correct");
		res.sendFile(path.join(__dirname+'/public/home.html'));
	} else {
		res.send("false");
	}
 
});

app.post('/home', (req, res) => {
  res.redirect("/home");
});

// try some calendar output here
app.post('/cal', async (req, res) => {
	
	let eventArray;
	console.log(req.body);	
	
	if (1)
	{
		eventArray = await database.listEvent();
		if (eventArray === null)
			res.send("empty");
		else 
			res.send(JSON.stringify(eventArray));
	}

//res.redirect("/cal");
});

// create event router
app.post('/create', async (req, res) => {

	console.log(req.body);

	
	let newEvent = new Event(req.body.name, req.body.description, req.body.start, req.body.end, req.body.url, null, serverId, 0);
	console.log(newEvent);

if (isNaN(newEvent.start))
	newEvent.start = null;
if (isNaN(newEvent.end))
	newEvent.end = null;

if (await database.editEvent(newEvent) === true)
{
	res.send("true");
}
	
	//res.redirect("/create");
});
//yeah i think this is probably wrong. i just copied your post and thought the db would edit if given an id - i dont really know how all of this communicates.
app.post('/edit', async (req, res) => {

	console.log(req.body);
	let editEvent = new Event(req.body.name, req.body.description, req.body.start, req.body.end, req.body.url, null, serverId, 0, req.body.id);
	console.log(editEvent);

	// event id validation
	if (await database.getEvent(editEvent.id) === null)
		res.send("false");
	else 
	{
		if (isNaN(editEvent.start))
			editEvent.start = null;
		if (isNaN(editEvent.end))
			editEvent.end = null;

		if (await database.editEvent(editEvent) === true)
		{
			res.send("true");
		}
		else 
			res.send("false");
	}

	
	
});

app.post('/delete', (req, res) => {
  res.redirect("/delete");
});

app.post('/contact', (req, res) => {
  res.redirect("/contact");
});

app.post('/help', (req, res) => {
  res.redirect("/help");
});

// END NAVIGATION

app.listen(PORT, () => {
  console.log(`${PORT}`)
});	
