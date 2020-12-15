var eventObj = {};

function addEvent(form) {

    let request = new XMLHttpRequest();

    request.open("POST", "/create");
    request.responseType = 'text';
    request.setRequestHeader('Content-type', 'application/json');
    
    request.onload = function() {
        
        console.log(request.response);
        
    };

  /*  eventObj[form.name.value] = {eventName: form.name.value, description: form.description.value, 
        start: form.startTime.value, end: form.endTime.value, url: form.url.value};
    console.log(eventObj);
    */
    eventObj = {eventName: form.name.value, description: form.description.value, 
        start: form.startTime.value, end: form.endTime.value, url: form.url.value};
    console.log(eventObj);

    eventObj.start = (new Date(eventObj.start + "-05:00")).getTime();
    eventObj.end = (new Date(eventObj.end + "-05:00")).getTime();

    request.send(JSON.stringify({
        name: eventObj.eventName,
        description: eventObj.description, 
        start: eventObj.start, 
        end: eventObj.end, 
        url: eventObj.url
    }));
    

    return false;   
}