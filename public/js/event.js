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

    console.log(eventObj);
    alert("Event Submitted!");

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

/* 
Jack -

the same comment i left in index.js can be applied here, with the additional notes that i did give the edit.html page
the proper 'onsubmit' to call the editEvent function. I also added alert boxes to give user feedback on whether or not
a submission was successful (although there's not really any error checking client-side), and added 'required' fields in the html 
forms to prevent necessary input from being excluded.

*/
function editEvent(form) { 
    let request = new XMLHttpRequest();

    request.open("POST", "/edit");
    request.responseType = 'text';
    request.setRequestHeader('Content-type', 'application/json');
    
    request.onload = function() {
        
        console.log(request.response);
        
    };

    eventObj = {eventId: form.eventId.value, eventName: form.name.value, description: form.description.value, 
        start: form.startTime.value, end: form.endTime.value, url: form.url.value};

    console.log(eventObj);
    alert("Event Changes Submitted!");
    
    eventObj.start = (new Date(eventObj.start + "-05:00")).getTime();
    eventObj.end = (new Date(eventObj.end + "-05:00")).getTime();

    request.send(JSON.stringify({
        id: eventObj.eventId,
        name: eventObj.eventName,
        description: eventObj.description, 
        start: eventObj.start, 
        end: eventObj.end, 
        url: eventObj.url
    }));

    return false;   
}