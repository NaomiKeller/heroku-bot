//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Database.js V1.0


// Event class 
class Event
{
    constructor(name, description, startTime, endTime, url, id = null)
    {
       
        this.id = id;
        this.name = name;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.url = url;
        
    }

    toString()
    {
        let name = this.name;
        let description = this.description;
        let startTime = this.startTime;
        let endTime = this.endTime;
        let url = this.url;

        if (name === undefined)
            name = "";
        if (description === undefined)
            description = "";
        if (startTime === undefined || isNaN(startTime))
            startTime = "";
        else 
            startTime = new Date(this.startTime).toString();
       
        if (endTime === undefined || isNaN(endTime))
            endTime = "";
        else 
            startTime = new Date(this.startTime).toString();
       
        if (url === undefined)
            url = "";
        
        let string = `Event ID: ${this.id}\nEvent name: ${name}\nEvent description: ${description}\nEvent start time: ${startTime}\nEvent end time: ${endTime}\nEvent url: ${url}\n`;
        return string;
    }

    
}

class Reminder
{
    

}

// Database class
// 
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
            /*for (i in newEvent)
            {
                if (newEvent.i === undefined)
            }*/
            let query = `INSERT INTO EVENT (event_name, event_description, event_start, event_end, event_url) 
                      VALUES (\'${newEvent.name}\', \'${newEvent.description}\', ${newEvent.startTime}, ${newEvent.endTime}, \'${newEvent.url}\');`;
            
            console.log(query);
            this.pool.query(query, (err, res) => {
                if(err) 
                {
                    throw err;
                    return false;
                }
     
            });

            return true;
        }
        else
        {
            return false;
        }
            
    }
/*
    async listEvent2()
    {
        let array;
        let query = 'SELECT * FROM EVENT;';
 
        await this.pool.query(query, (err, res) => {
            if(err) {
                throw err;
            }
            array = res.rows;
            console.log("inside query");
            console.log(array);    
               
        });
        console.log("inside func");
        console.log(array);    
        return array;
    }
    */


    // list all events in the database
    // precondition: none
    // postcondition: an array of Event objects
    listEvent()
    {
        return new Promise(resolve => {
            let array;
            let query = 'SELECT * FROM EVENT;';
 
            this.pool.query(query, (err, res) => {
                if(err) {
                    throw err;
                }
                array = res.rows;
                    
                resolve(array);
            });
        });     
    };

    test()
    {
        return "file";
    }


}


module.exports.Database = Database;
module.exports.Event = Event;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////