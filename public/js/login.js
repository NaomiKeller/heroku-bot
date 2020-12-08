
// control login form

var username = document.forms['form']['username']
var password = document.forms['form']['password']

var request = new XMLHttpRequest();

function loginReq()
{
    // send request to server

    request.open("POST", "/");
    request.responseType = 'text';
    request.setRequestHeader('Content-type', 'application/json');
    
    request.onload = function() {
        
        if (request.response === "false")
            alert("Your credentials are incorrect.");
        else 
        {
            // this version works, but it does not block users directly accessing /home without entering username & password.
            window.location = "/home"
            // Deleted alert for successful login, don't think it's necessary
        }
    };
    
    request.send(JSON.stringify({
        username: username.value,
        password: password.value
    }));
    
    
}
