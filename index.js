const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
console.log(__dirname);

// NAVIGATION 
// (is there a more efficient way of doing this other than getting and posting every individual fucking page?)

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname+'/index.html')); // login
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

	console.log(req, "\n", req.body);
 
});

app.post('/home', (req, res) => {
  res.redirect("/home");
});

app.post('/cal', (req, res) => {
  res.redirect("/cal");
});

app.post('/create', (req, res) => {
  res.redirect("/create");
});

app.post('/edit', (req, res) => {
  res.redirect("/edit");
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
