//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Database.js V1.1
//

// Event class 
class Event
{
    constructor(name, description, startTime, endTime, url, serverId, id)
    {
       
        this.id = id;
        this.name = name;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.url = url;
        this.serverId = serverId;
        
    }

    // this method only formats date/time
    toString()
    {   

        let startTime = this.startTime;
        let endTime = this.endTime; 
        
        if (startTime === undefined || startTime === null || isNaN(startTime) || startTime === 0)
            startTime = null;
        else 
            startTime = new Date(this.startTime).toLocaleString('en-US', {timeZone: "America/New_York"}) + " ET";
       
        if (endTime === undefined || endTime === null || isNaN(endTime) || endTime === 0)
            endTime = null;
        else
            endTime = new Date(this.endTime).toLocaleString('en-US', {timeZone: "America/New_York"}) + " ET";
            
    
        let string = `Event ID: ${this.id}\nEvent name: ${this.name}\nEvent description: ${this.description}\nEvent start time: ${startTime}\nEvent end time: ${endTime}\n` +
                        `Event url: ${this.url}\nEvent server: ${this.serverId}\n`;
        return string;
    }

    fillBlank()
    {
        if (this.description === undefined)
            this.description = null;
        if (this.startTime === undefined)
            this.startTime = null;
        if (this.endTime === undefined)
            this.endTime = null;
        if (this.url === undefined)
            this.url = null;
    }
    
}

// reminder class
class Reminder
{
    constructor(eventId, time, id = null)
    {
        this.eventId = eventId;
        this.time = time;
        this.id = id;
    }

    toString()
    {
        let string = `Reminder ID: ${this.id}\nEvent ID: ${this.eventId}\nTime: `;

        if (this.time === undefined || isNaN(this.time) || this.time === 0)
            string += "";
        else 
            string += new Date(this.time).toLocaleString('en-US', {timeZone: "America/New_York"}) + " ET\n";

        return string;
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

    toString()
    {
        let string = `Event ID: ${this.eventId}\nUser ID: ${this.userId}\n`;
        return string;
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

    // edit an event (create or modify)
    // parameter 1: event object (if the event has an valid ID, it will enter the modfiying mode. Otherwise it will enter the creating mode)
    // return: true for success, false for error
    async editEvent(event)
    {
        let query;
        let result;
        let succeed;

        if (event instanceof Event === false)
            succeed = false;
        else 
        {
            // create an event
            if (isNaN(event.id))       
            {
                query = `INSERT INTO EVENT (event_name, event_description, event_start, event_end, event_url, event_serverid) 
                          VALUES (\'${event.name}\', \'${event.description}\', ${event.startTime}, ${event.endTime}, \'${event.url}\', \'${event.serverId}\');`;
            }
            // modify an existing event
            else        
            {
                query = `UPDATE EVENT
                        SET EVENT_NAME = \'${event.name}\', EVENT_DESCRIPTION = \'${event.description}\', EVENT_START = ${event.startTime}, EVENT_END = ${event.endTime}, EVENT_URL = \'${event.url}\'
                        WHERE EVENT_ID = ${event.id};`;
        
            }
            
            await this.pool.query(query, (err, res) => {
                if(err) 
                    throw err; 
            });
            succeed = true;
        }
        
        return succeed;
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

        if (result.rows.length === 0)
            return null;

        for (let i of result.rows)
        {
            temp = new Event(i.event_name, i.event_description, Number(i.event_start), Number(i.event_end), i.event_url, i.event_serverid, i.event_id);
            eventArray.push(temp);
        }

        return eventArray;
    };

    // to get a single event 
    // parameter 1: event ID 
    // return: event object or null 
    async getEvent(eventId)
    {
        let result;
        let event;
        let query = `SELECT * FROM EVENT
                        where event_id = ${eventId};`;
            
        result = await this.pool.query(query);
      
        if (result.rows.length === 0)
            return null;
        else 
        {
            result = result.rows[0];
            event = new Event(result.event_name, result.event_description, Number(result.event_start), Number(result.event_end), result.event_url, result.event_serverid, Number(result.event_id));
    
            return event;
        }
        
    };

    
    // to delete an event from the database
    // parameter 1: event id
    // return: true for success, false for error
    async deleteEvent(eventId)
    {
        let succeed;
        let query;

        if (isNaN(eventId))
            succeed = false;
        else if (await this.getEvent(eventId) === null)
            succeed = false;
        else 
        {
            // delete relative advertisements
            query = `DELETE FROM ADVERTISEMENT 
                        WHERE advert_eventid = ${eventId};`;
            await this.pool.query(query, (err, res) => {
                if(err)             
                    throw err;

            });  

            // delete relative subscriptions
            query = `DELETE FROM SUBSCRIPTION 
                        WHERE sub_eventId = ${eventId};`;
            await this.pool.query(query, (err, res) => {
                if(err)             
                    throw err;

            });  

            // delete relative reminders
            query = `DELETE FROM REMINDER 
                        WHERE rem_eventid = ${eventId};`;
            await this.pool.query(query, (err, res) => {
                if(err)             
                    throw err;

            });  

            query = `DELETE FROM EVENT 
                        WHERE EVENT_ID = ${eventId};`;

            await this.pool.query(query, (err, res) => {
                if(err)             
                    throw err;

            });  
            succeed = true;
        }
        
        return succeed;
    }


    // create a Reminder
    // parameter 1: a reminder object
    // return: true for success and false for Error
    async createReminder(newReminder)
    {
        if (newReminder instanceof Reminder)
        {
            
            let query = `INSERT INTO REMINDER (rem_eventid, rem_time) 
                      VALUES (\'${newReminder.eventId}\', ${newReminder.time});`;
            
            await this.pool.query(query, (err, res) => {
                if(err) 
                    throw err;
            });

            return true;
        }
        else    
            return false;
    }

    // list all reminders in the database
    // parameter 1: none
    // return: an array of reminder objects
    async listReminder()
    {
        let result;
        let remArray = [];
        let temp;
        let query = 'SELECT * FROM REMINDER;';
 
        result = await this.pool.query(query);

        if (result.rows.length === 0)
            return null;

        for (let i of result.rows)
        {
            temp = new Reminder(i.rem_eventid, Number(i.rem_time), Number(i.rem_id));
            remArray.push(temp);
        }

        return remArray;
    };

    // to get a single reminder 
    // parameter 1: reminder ID 
    // return: reminder object or null 
    async getReminder(remId)
    {
        let result;
        let reminder;
        let query = `SELECT * FROM REMINDER
                        where rem_id = ${remId};`;
            
        result = await this.pool.query(query);
        if (result.rows.length === 0)
            return null;
        else 
        {
            result = result.rows[0];
            temp = new Reminder(result.rem_eventid, Number(result.rem_time), Number(result.rem_id));

            return reminder;
        }
        
    };

    // delete a reminder
    // parameter 1: reminder id
    // return: true for success and false for Error
    async deleteReminder(remId)
    {
        let succeed;
        let query;

        if (isNaN(remId))
            succeed = false;
        else if (await this.getReminder(remId) === null)
            succeed = false;
        else 
        {
            query = `DELETE FROM REMINDER 
                        WHERE REM_ID = ${remId};`;

            await this.pool.query(query, (err, res) => {
                if(err) 
                    throw err;           
            }); 
            succeed = true;
        }
        return succeed;
    
    }

    // create an advertisement in the database
    // parameter: an advertisement object 
    // return: true for success and false for error
    async createAdvert(newAdvert)
    {
        if (newAdvert instanceof Advertisement)
        {
            
            let query = `INSERT INTO Advertisement (advert_messageid, advert_eventid, advert_serverid) 
                      VALUES (\'${newAdvert.messageId}\', ${newAdvert.eventId}, \'${newAdvert.serverId}\');`;
                       
            await this.pool.query(query, (err, res) => {
                if(err) 
                    throw(err);   
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
        
        result = await this.pool.query(query);
        if (result.rows.length === 0)
            return null;
        else 
        {
            advertisement = new Advertisement(result.rows[0].advert_messageid, Number(result.rows[0].advert_eventid), result.rows[0].advert_serverid);   
            return advertisement;   
        } 
    };



    // create a subscription in the database
    // parameter 1: a subscription object 
    // return: true for success and false for error
    async createSub(newSub)
    {   
        let query;
        let result;

        if (newSub instanceof Subscription)
        {
            // check if the sub exists 
            query = `SELECT * FROM SUBSCRIPTION 
                            WHERE sub_eventId = ${newSub.eventId} AND sub_userId = \'${newSub.userId}\';`;
            result = await this.pool.query(query);
            if (result.rows.length === 0)
            {
                query = `INSERT INTO SUBSCRIPTION (sub_userId, sub_eventId) 
                      VALUES (\'${newSub.userId}\', ${newSub.eventId} );`;
                           
                await this.pool.query(query, (err, res) => {
                    if(err) 
                        throw err;
                });

                return true;
            
            }
            else 
                return false;
            
        }
        else
            return false;
 
    }

    // delete a subscription in the database
    // parameter 1: event ID.
    // parameter 2: user ID
    // return: true for success and false for error
    async deleteSub(eventId, userId)
    {
        let succeed;
        let query;

        if (isNaN(eventId))
            succeed = false;
        else if (this.getEvent(eventId) === null)
            succeed = false;
        else 
        {
            query = `DELETE FROM SUBSCRIPTION 
                        WHERE sub_eventId = ${eventId} AND sub_userId = \'${userId}\';`;

            await this.pool.query(query, (err, res) => {
                if(err) 
                    throw err;           
            }); 
            succeed = true;
        }
        return succeed;
    }

    // list subscriptions from the database
    // parameter 1: event ID. (if the event ID is provided, the function only returns one subscription entry. Otherwise, it returns an array of subscriptions)
    // return: a subscription object or a subscription array.
    async listSub(eventId = 0)
    {
        let result;
        let subArray = [];
        let temp;
        let query;
        
        if (eventId === 0)
            query = 'SELECT * FROM SUBSCRIPTION;';
        else
        {
            if (await this.getEvent(eventId) === null)
                return null;
            else 
                query = `SELECT * FROM SUBSCRIPTION 
                            WHERE sub_eventId = ${eventId};`;
        }   

        result = await this.pool.query(query);

        if (result.rows.length === 0)
            return null;

        for (let element of result.rows)
        {
            
            temp = new Subscription(element.sub_userid, Number(element.sub_eventid));
            subArray.push(temp);
        }

        return subArray;
    };
}

module.exports.Database = Database;
module.exports.Event = Event;
module.exports.Subscription = Subscription;
module.exports.Advertisement = Advertisement;
module.exports.Reminder = Reminder;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
