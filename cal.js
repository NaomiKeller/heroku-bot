const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const PORT = process.env.PORT || 5000;



router.get('/', (req, res) => {
	res.render('index.html');
  //res.sendFile(path.join(__dirname+'/index.html'));
});

app.use('/', router);




/*
app.get('/', (req, res) => {
  res.senfFile('cal.html')
})
*/

app.listen(PORT, () => {
  console.log(`${PORT}`)
})	
