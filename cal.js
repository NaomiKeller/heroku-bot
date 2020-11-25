const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
console.log(__dirname);

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname+'public/index.html'));
});
/*
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname+'/home.html'));
});

app.post('/home', (req, res) => {
  res.redirect("/home");
});
*/

app.listen(PORT, () => {
  console.log(`${PORT}`)
});	

