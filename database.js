//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Database file test version

class Event
{
    constructor(name, description, startTime, endTime, url)
    {
        this.name = name;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.url = url;
    }
}

class Database
{
    constructor()
    {
        const { Pool } = require ('pg');    
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        this.pool.connect((err, client, release) => 
        {
            if (err) {
                console.log('Error acquiring client', err.stack)
            }
        });
    }

    // create a event in the database
    // prcondition: an Event object 
    // postcondition: true for success and false for error
    createEvent (newEvent) 
    {
        if (newEvent instanceof Event)
        {
            
            let query = `INSERT INTO EVENT (event_name, event_description, event_start, event_end, event_url) 
                      VALUES (\'${newEvent.name}\', \'${newEvent.description}\', ${newEvent.startTime}, ${newEvent.endTime}, \'${newEvent.url}\');`;
            
            console.log(query);
            this.pool.query(query, (err, res) => {
                if(err) 
                    throw err;
                
            });
            
            
            return true;
        }
        else
        {
            return false;
        }
            
    }

    test()
    {
        return "file";
    }
}


module.exports.Database = Database;
module.exports.Event = Event;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////