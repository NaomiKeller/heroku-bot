var eventObj = {};

function addEvent(form) {

    eventObj[form.name.value] = {eventName: form.name.value, description: form.description.value, 
        start: form.startTime.value, end: form.endTime.value, url: form.url.value};
    console.log(eventObj);

    let request = new XMLHttpRequest();
    request.open("POST", "/create");
    request.responseType = 'text';
    request.setRequestHeader('Content-type', 'application/json');
    
    request.onload = function() {
        
        console.log(request.response);
        
    };
    
    

    request.send(JSON.stringify({
        eventName: form.name.value, 
        description: form.description.value, 
        start: form.startTime.value, 
        end: form.endTime.value, 
        url: form.url.value
    }));
    

    return false;   
}