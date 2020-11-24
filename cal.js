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

/*
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/home.html`);
});
*/
//////////////////////////////////////////////////
var username = document.forms['form']['username']
var password = document.forms['form']['password']

var loginError = document.getElementById('loginError');

username.addEventListener('click', reset);

function validated() {
    if (username.value === "admin" && password.value === "pass") {
        res.redirect('home.html');
        return true;
    } else {
        loginError.style.display = "block";
        username.focus();
        password.focus();
        return false;
    }
}

function reset() {
    loginError.style.display = "none";
}
////////////////////////////////////////////////
//app.use('/', router);




/*
app.get('/', (req, res) => {
  res.senfFile('cal.html')
})
*/

app.listen(PORT, () => {
  console.log(`${PORT}`)
})	
