
// control login form

var username = document.forms['form']['username']
var password = document.forms['form']['password']

var loginError = document.getElementById('loginError');

username.addEventListener('click', reset);

function validated() {
    if (username.value === "admin" && password.value === "pass") {
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

function loginReq()
{
    // send request to server
    let request = new XMLHttpRequest();
    request.open('POST', "/");
    request.responseType = 'text';
    request.onload = function() {
      alert(request.response);
    };

    request.send();
}