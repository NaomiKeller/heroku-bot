

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var request = new XMLHttpRequest();

request.open("GET", "https://forgetmebot.herokuapp.com/");
request.responseType = 'text';
request.setRequestHeader('Content-type', 'application/json');
    
request.onload = function() {
        
    console.log(request);
    console.log(request.response);
};

request.send();

