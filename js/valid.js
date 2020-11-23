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
/*
function userVerify() {
    if (username === "administrator") {
        userError.style.display = "none";
        return true;
    } else {
        return false;
    }
}


function userVerify() {
    if (username.value.length >= 8) {
        userError.style.display = "none";
        if (username.value === 'administrator') {
            return true;
        }
    }
}

function passVerify() {
    if (password.value.length >= 5) {
        passError.style.display = "none";
        return true;
    }
}
*/