var eventObj = {};

function addEvent(form) {

    let request = new XMLHttpRequest();

    request.open("POST", "/create");
    request.responseType = 'text';
    request.setRequestHeader('Content-type', 'application/json');
    
    request.onload = function() {
        
        console.log(request.response);
        
    };

    eventObj = {eventName: form.name.value, description: form.description.value, 
        start: form.startTime.value, end: form.endTime.value, url: form.url.value};

    eventObj.start = (new Date(eventObj.start + "-05:00")).getTime();
    eventObj.end = (new Date(eventObj.end + "-05:00")).getTime();

    console.log(eventObj);
    alert("Event Submitted!");

    request.send(JSON.stringify({
        name: eventObj.eventName,
        description: eventObj.description, 
        start: eventObj.start, 
        end: eventObj.end, 
        url: eventObj.url
    }));

    return false;   
}

function editEvent(form) {
    let eventID = form.ID.value;
    console.log(eventID);
}