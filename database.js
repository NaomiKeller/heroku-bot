//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Database file test version



// create a event in the database
// prcondition: an Event object 
// postcondition: true for success and false for error
function createEvent (newEvent) 
{
    if (newEvent instanceof Event)
    {
        let query = `INSERT INTO event (event_name, event_description, event_start, event_end, event_url)
                    VALUES (${newEvent.name}, ${newEvent.description}, ${newEvent.startTime}, ${newEvent.endTime}, ${newEvent.name});`;
            
        databaseHandle.query(query, (err, res) => {
                if(err) throw err;
        });

            
        return true;
    }
    else 
        return false;
}

test()
{
    return "file";
}

module.export.createEvent = createEvent;
module.export.test = test;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////