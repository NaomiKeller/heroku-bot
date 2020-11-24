const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const PORT = process.env.PORT || 5000;


app.use(express.static(__dirname));
console.log(__dirname);

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname+'/index.html'));
});

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname+'/home.html'));
});


//app.use('/', router);




/*
app.get('/', (req, res) => {
  res.senfFile('cal.html')
})
*/

app.listen(PORT, () => {
  console.log(`${PORT}`)
})	
