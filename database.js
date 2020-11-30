//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Database.js V1.0
//

// Event class 
class Event
{
    constructor(name, description, startTime, endTime, url, userId, serverId, permission, id)
    {
       
        this.id = id;
        this.name = name;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.url = url;
        this.userId = userId;
        this.serverId = serverId;
        this.permission = permission;
    }

    // this method only formats date/time
    toString()
    {   

        let startTime = this.startTime;
        let endTime = this.endTime; 
        
        if (startTime !== undefined && !isNaN(startTime))
            startTime = new Date(this.startTime).toString();
       
       
        if (endTime !== undefined && !isNaN(endTime))
            endTime = new Date(this.endTime).toString();
            
    
        let string = `Event ID: ${this.id}\nEvent name: ${this.name}\nEvent description: ${this.description}\nEvent start time: ${startTime}\nEvent end time: ${endTime}\nEvent url: ${url}\n` +
                        `Event permission: ${this.permission}\nEvent owner: ${this.userId}\nEvent server: ${this.serverId}\n`;
        return string;
    }

    
}

// reminder class
class Reminder
{
    constructor(eventId, time, info = null, id = null)
    {
        this.eventId = eventId;
        this.time = time;
        this.info = info;
        this.id = id;
    }

}

// subscription class
class Subscription
{
    constructor(userId, eventId)
    {
        this.eventId = eventId;
        this.userId = userId;
    }

}

// Advertisement class
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

    // create an event in the database
    // parameter 1: an Event object 
    // return: true for success and false for error
    createEvent (newEvent) 
    {
        if (newEvent instanceof Event)
        {
            let query = `INSERT INTO EVENT (event_name, event_description, event_start, event_end, event_url, event_userid, event_serverid, event_permission) 
                      VALUES (\'${newEvent.name}\', \'${newEvent.description}\', ${newEvent.startTime}, ${newEvent.endTime}, \'${newEvent.url}\', \'${newEvent.userId}\', \'${newEvent.serverId}\', \'${newEvent.permission}\');`;
            
            this.pool.query(query, (err, res) => {
                if(err) 
                {
                    throw err;
                    
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
    // parameter 1: none
    // return: an array of Event objects
    async listEvent()
    {
        let result;
        let eventArray = [];
        let temp;
        let query = 'SELECT * FROM EVENT;';
 
        result = await this.pool.query(query);
        for (let i of result.rows)
        {
            temp = new Event(i.event_name, i.event_description, Number(i.event_start), Number(i.event_end), i.event_url, i.event_userid, i.event_serverid, i.event_permission, i.event_id);
            eventArray.push(temp);
        }

        return eventArray;
    };

    // to get a single event 
    // parameter 1: event ID 
    // return: event object
    async getEvent(eventId)
    {
        let result;
        let event;
        let query = `SELECT * FROM EVENT
                        where event_id = ${eventId};`;
            
        result = await this.pool.query(query);
        result = result.rows[0];
        console.log(result);

        event = new Event(result.event_name, result.event_description, result.event_start, result.event_end, result.event_url, result.event_userid, result.event_serverid, result.event_permission, result.event_id);
    
        return event;
    };

    // create a Reminder
    // parameter 1: a reminder object
    // return: true for success and false for Error
    createReminder(newReminder)
    {
        if (newReminder instanceof Reminder)
        {
            
            let query = `INSERT INTO REMINDER (rem_eventid, rem_time, rem_info) 
                      VALUES (\'${newReminder.eventId}\', ${newReminder.time}, \'${newReminder.info}\');`;
            
            console.log(query);
            this.pool.query(query, (err, res) => {
                if(err) 
                {
                    console.error(err);
                }
     
            });

            return true;
        }
        else    
            return false;
    }


    // create an advertisement in the database
    // parameter: an advertisement object 
    // return: true for success and false for error
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

    // to get a single advertisement 
    // parameter 1: message ID (advertisement ID)
    // return: advertisement object
    async getAdvert(advertId)
    {
        let result;
        let advertisement;
        let query = `SELECT * FROM ADVERTISEMENT
                        where advert_messageid = \'${advertId}\';`;
        
        console.log(query);
        
        result = await this.pool.query(query);
        advertisement = new Advertisement(result.rows[0].advert_messageid, result.rows[0].advert_eventid, result.rows[0].advert_serverid);    

        return advertisement; 
        
    };

    // create a subscription in the database
    // parameter 1: a subscription object 
    // return: true for success and false for error
    createSub(newSub)
    {   
        if (newSub instanceof Subscription)
        {
            
            let query = `INSERT INTO SUBSCRIPTION (sub_userId, sub_eventId) 
                      VALUES (\'${newSub.userId}\', ${newSub.eventId} );`;
            
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
module.exports.Reminder = Reminder;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
