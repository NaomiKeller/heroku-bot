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

function listEvent()
{
    let request = new XMLHttpRequest();
    let eventArray = [];

    request.open("POST", "/cal");
    request.responseType = 'text';
    request.setRequestHeader('Content-type', 'application/json');
    
    request.onload = function() {
        
        if (request.response === 'empty')
        {
            console.log(request.response);
            alert("There are no events");
        }
        else 
        {
            eventArray = JSON.parse(request.response);
            console.log('\n', eventArray);

            for (let event of eventArray)
            {
                ;
            }

            var html = "<table border='1|1'>";

            html+="<tr>";
            html+="<th>Event Name</th>";
            html+="<th>Event ID</th>"; 
            html+="<th>Description</th>"; 
            html+="<th>Start Time</th>"; 
            html+="<th>End Time</th>"; 
            html+="<th>URL</th>";  
            html+="</tr>";

            for (var i=0; i<eventArray.length;i++) {
                var startTime, endTime;

                if (eventArray[i].startTime > 0) {
                    startTime = new Date(eventArray[i].startTime).toLocaleString('en-US', {timeZone: "America/New_York"}) + " ET";
                } else {
                    startTime = "No date";
                }

                if (eventArray[i].endTime > 0) {
                    endTime = new Date(eventArray[i].startTime).toLocaleString('en-US', {timeZone: "America/New_York"}) + " ET";
                } else {
                    endTime = "No date";
                }

                html+="<tr>";
                html+="<td>"+eventArray[i].name+"</td>";
                html+="<td>"+eventArray[i].id+"</td>";
                html+="<td>"+eventArray[i].description+"</td>";
                html+="<td>"+startTime+"</td>";
                html+="<td>"+endTime+"</td>";
                html+="<td>"+eventArray[i].url+"</td>";
                html+="</tr>";
            }
            html += "</table>";
            document.getElementById("jsTable").innerHTML = html;
        }
        
    };

    request.send(JSON.stringify({
        msg: "listEvent"
    }));

}
