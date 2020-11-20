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
            endTime = new Date(this.endTime).toString();
       
        if (url === undefined)
            url = "";
        
        let string = `Event ID: ${this.id}\nEvent name: ${name}\nEvent description: ${description}\nEvent start time: ${startTime}\nEvent end time: ${endTime}\nEvent url: ${url}\n`;
        return string;
    }

    
}

class Subscription
{
    constructor(eventId, userId)
    {
        this.eventId = eventId;
        this.userId = userId;
    }

}

class Advertisement
{
    constructor(messageId, eventId, serverId, )
    {
        this.messageId = messageId;
        this.eventId = eventId;
        this.serverId = serverId;

    }

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
            let query = `INSERT INTO EVENT (event_name, event_description, event_start, event_end, event_url) 
                      VALUES (\'${newEvent.name}\', \'${newEvent.description}\', ${newEvent.startTime}, ${newEvent.endTime}, \'${newEvent.url}\');`;
            
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

    // list all events in the database
    // precondition: none
    // postcondition: an array of Event objects
    async listEvent()
    {
        let result;
        let eventArray = [];
        let temp;
        let query = 'SELECT * FROM EVENT;';
 
        result = await this.pool.query(query);
        for (let element of result.rows)
        {
            temp = new Event(element.event_name, element.event_description, Number(element.event_start), Number(element.event_end), element.event_url, element.event_id);
            eventArray.push(temp);
        }

        return eventArray;
    };

    // to get a single event 
    // precondition: event ID 
    // postcondition: event object
    async getEvent(eventId)
    {
        let result;
        let event;
        let query = `SELECT * FROM EVENT
                        where event_id = ${eventId};`;
            
        result = await this.pool.query(query);

        event = new Event(result.rows[0].event_name, result.rows[0].event_description, result.rows[0].event_start, result.rows[0].event_end, result.rows[0].event_url, result.rows[0].event_id);
    
        return event;
    };

    // create an advertisement in the database
    // prcondition: an advertisement object 
    // postcondition: true for success and false for error
    createAdvert(newAdvert)
    {
        if (newAdvert instanceof Advertisement)
        {
            
            let query = `INSERT INTO Advertisement (advert_messageid, advert_eventid, advert_serverid) 
                      VALUES (\'${newAdvert.messageId}\', ${newAdvert.eventId}, \'${newAdvert.serverId}\');`;
            
            console.log(query);
            this.pool.query(query, (err, res) => {
                if(err) 
                {
                    console.error(err);
                    return false;
                }
     
            });

            return true;
        }
        else    
            return false;

    }

    async getAdvert(advertId)
    {
        let result;
        let advertisement;
        let query = `SELECT * FROM ADVERTISEMENT
                        where advert_messageid = ${advertId};`;
        console.log(advertId);
        console.log(query);
        /*
        result = await this.pool.query(query);
        advertisement = new Advertisement(result.rows[0].advert_messageid, result.rows[0].advert_eventid, result.rows[0].advert_serverid);    
        console.log(advertisement);
        console.log('inside');
        return advertisement; 
        */
    };

    createSub(newSub)
    {   
        if (newSub instanceof Subscription)
        {
            
            let query = `INSERT INTO SUBSCRIPTION (sub_eventId, sub_userId) 
                      VALUES (\'${newSub.eventId}\', \'${newSub.userId}\');`;
            
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

    removeSub(existingSub)
    {
        
    }
}

module.exports.Database = Database;
module.exports.Event = Event;
module.exports.Subscription = Subscription;
module.exports.Advertisement = Advertisement;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////