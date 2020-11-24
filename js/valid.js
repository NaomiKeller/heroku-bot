// Validation for login input
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