const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const PORT = process.env.PORT || 5000;


//res.render('index');
router.get('/', (req, res) => {
	res.send('<p>index.html</p>')
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
