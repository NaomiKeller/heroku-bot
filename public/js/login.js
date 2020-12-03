
// control login form



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

    request.send();

    
}