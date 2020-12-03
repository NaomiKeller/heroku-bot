
// control login form

var username = document.forms['form']['username']
var password = document.forms['form']['password']

function loginReq()
{
    // send request to server
    let request = new XMLHttpRequest();
    request.open('POST', "/");
    request.responseType = 'text';
    request.onload = function() {
        if (request.response === "false")
            alert("Your credentials are incorrect.");
    };

    request.send(JSON.stringify({
        username: username.value,
        password: password.value
    }));

    
}