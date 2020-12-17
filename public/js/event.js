var eventObj = {};

function addEvent(form) {

    let request = new XMLHttpRequest();

    request.open("POST", "/create");
    request.responseType = 'text';
    request.setRequestHeader('Content-type', 'application/json');
    
    request.onload = function() {
        
        if (request.response === 'true')
            alert("Event Submitted!");
    };

    eventObj = {eventName: form.name.value, description: form.description.value, 
        start: form.startTime.value, end: form.endTime.value, url: form.url.value};

    eventObj.start = (new Date(eventObj.start)).getTime();
    eventObj.end = (new Date(eventObj.end)).getTime();

    if (isNaN(eventObj.start)) {

        alert("Start date invalid. Please try again.");

    } else {
        
        request.send(JSON.stringify({
            name: eventObj.eventName,
            description: eventObj.description, 
            start: eventObj.start, 
            end: eventObj.end, 
            url: eventObj.url
        }));

        return false;  
    }
}

function editEvent(form) { 

    let request = new XMLHttpRequest();

    request.open("POST", "/edit");
    request.responseType = 'text';
    request.setRequestHeader('Content-type', 'application/json');
    
    request.onload = function() {
        
        if (request.response === 'false')
            alert("Invalid Event ID");
        else 
            window.location.reload();
        
    };

    eventObj = {eventId: form.eventId.value, eventName: form.name.value, description: form.description.value, 
        start: form.startTime.value, end: form.endTime.value, url: form.url.value};
    
    eventObj.start = (new Date(eventObj.start)).getTime();
    eventObj.end = (new Date(eventObj.end)).getTime();

    if (isNaN(eventObj.start)) {

        alert("Start date invalid. Please try again.")

    } else {

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
            alert("There are no events");
        }
        else 
        {
            eventArray = JSON.parse(request.response);

            // draw table
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


function deleteEvent(form)
{
    let request = new XMLHttpRequest();
    let eventId = form.eventId.value

    request.open("POST", "/delete");
    request.responseType = 'text';
    request.setRequestHeader('Content-type', 'application/json');
    
    request.onload = function() {
  
        if (request.response === 'true')
        {
            //reload page;
            window.location.reload();
        }
        else 
            alert("Invalid Event ID");
    };  

    request.send(JSON.stringify({
            id: eventId
    }));

    return false;   
}

function displayCal()
{
    let request = new XMLHttpRequest();
    let eventArray = [];

    request.open("POST", "/cal");
    request.responseType = 'text';
    request.setRequestHeader('Content-type', 'application/json');
    
    request.onload = function() {
        
        if (request.response === 'empty')
        {
            alert("There are no events");
        }
        else 
        {
            eventArray = JSON.parse(request.response);

            let html = "<table border='1|1'>";

            const date = new Date(); 
            const days = getDaysInMonth(date.getYear(), date.getMonth());
            date.setDate(1);
            const firstWeekDay = date.getDay();
            const weeks = Math.ceil((days + firstWeekDay) / 7);

            console.log(eventArray);


            let filtered = eventArray.filter(event => 
            {
                let start = new Date(event.startTime);
                console.log(start);
                if (start.getMonth() === date.getMonth() && start.getYear() === date.getYear())
                    return true;
                else 
                    return false;
            });

            console.log(filtered);

            // headers

            html += "<tr>";
            html += "<th style=\"width:14%\"> Sun</th>";
            html += "<th style=\"width:14%\">Mon</th>"; 
            html += "<th style=\"width:14%\">Tue</th>"; 
            html += "<th style=\"width:14%\">Wed</th>"; 
            html += "<th style=\"width:14%\">Thu</th>"; 
            html += "<th style=\"width:14%\">Fri</th>";  
            html += "<th style=\"width:14%\">Sat</th>";  
            html += "</tr>";

    
            let eventString;
            let curDate = 0;
            for (curWeek = 0; curWeek < weeks; curWeek++)
            {
                
                html += "<tr style = \"line-height:20px;\">";        // row starts

                for (let i = 0; i < 7; i++)
                {
                    if ((curDate < 1 && i < firstWeekDay) || curDate >= days)
                        html += "<td> </td>";
                    else 
                    {
                        curDate++;
                        html += "<td style=\"text-align:left;vertical-align:top;height:30px;padding-left:5px;\">" + curDate + "<br/>";

                        for (let event of filtered)
                        {
                            checkStart = new Date(event.startTime);
                            if (checkStart !== 0 && checkStart.getDate() === curDate)
                            {
                                let start = checkStart.getHours() + ":" + (checkStart.getMinutes() === 0 ? "00" : checkStart.getMinutes());
                        
                                eventString = "";
                                eventString += (event.name + " - " + start);
                                html += eventString + "</td>";
                            }
                        }

                        html += "</td>";   
                    }
                }
            
                html += "</tr>";    // row ends
      
            }

            document.getElementById("jsTable").innerHTML = html;
        }
        
    };

    request.send(JSON.stringify({
        msg: "listEvent"
    }));

    
}

function getDaysInMonth(year, month)
{
    if (!Number.isInteger(year) || !Number.isInteger(month))
        return undefined;

    switch(month)
    {
        case 0:
            return 31;
        case 1:     // Feburary
            if (year % 100 === 0)
            {
                if (year % 4 === 0)
                    return 29;
                else 
                    return 28;
            }
            else if (year % 4 === 0)
                return 29;
            else 
                return 28;

        case 2:
            return 31;
        case 3:
            return 30;
        case 4:
            return 31;
        case 5:
            return 30;
        case 6:
            return 31;
        case 7:
            return 31;
        case 8:
            return 30;
        case 9:
            return 31;
        case 10:
            return 30;
        case 11:
            return 31;
        default:
            return undefined;
    
    }

}