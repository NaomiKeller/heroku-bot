var eventObj = {};

function addEvent(form) {
    eventObj[form.name.value] = {eventName: form.name.value, description: form.description.value, 
        start: form.startTime.value, end: form.endTime.value, url: form.url.value};
    console.log(eventObj);
    return false;
    
}