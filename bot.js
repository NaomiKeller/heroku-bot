const Discord = require('discord.js');
const config = require("./config.json");
const { Pool } = require ('pg');    
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
// bot user id = 754442070596386967

const { Database, Event, Reminder, Advertisement, Subscription} = require('./database.js');
const database = new Database();

const { Worker, isMainThread, parentPort } = require('worker_threads');

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });


//////////////////////////////////////////////////////////////////////////////////////
// a section for temporary event

const tempEventsArray = [];
const invalid = "```Invalid command! Please view !help for a full list of valid commands!```";

// check if there is a temporary event being cached
// parameter 1: user id
// parameter 2: server id
// parameter 3: temporary event array
// return: object for existing, null for non-existing
function checkTempEvent(userID, serverID, eventArray)
{
    for (element of eventArray)
    {
        if (element.userId === userID && element.serverId === serverID)
        { 
            return element;
        }
    }
    return null;   
}

// section ends
//////////////////////////////////////////////////////////////////////////////////////


client.on('ready', () => {
    console.log('I am ready!');
    client.user.setActivity("Don't forget!"); // "Playing <>" status message for bot

    // other threads
    let remContrl = new Worker("./reminderCtrl.js");    // reminder control thread
    let selfPing = new Worker("./selfPing.js");

    //This should be opened as soon as the bot is ready! Do not close the connection to the pool later. :)
    pool.connect();
});


client.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;


    let prefix = config.prefix; // prefix is '!'. Set in config.json
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let d = new Date();
    let helpArray = ["!blip", " !site", " !ListEvent", " !event help"]; // List of available commands
    // going to add event command case that includes brief overview of event management commands
    if (cmd === `${prefix}blip`) {
        return message.channel.send("```blap```");
    }

    if (cmd === `${prefix}help`) {
        return message.channel.send("Available commands: " + `${helpArray}`);
    }

    if (cmd === `${prefix}site`) {
        return message.channel.send("https://forgetmebot.herokuapp.com");
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
    // event editor:
    // 
    if (cmd === `${prefix}event`) {

        let currentEvent = checkTempEvent(message.author.id, message.guild.id, tempEventsArray);
        

        if (currentEvent === null && args[0] !== "create" && args[0] !== "edit" && args[0] !== "delete" && args[0] !== "list")
            message.channel.send("```"+"Use command \"!event create [event name]\" or \"!event edit [event id]\" first"+"```");
        else
        {
            switch (args[0])
            {

            case "create":      // create mode
                if (currentEvent !== null)
                    message.channel.send("```"+"Failure: There is an unsaved event. Use \"!event confirm\" or \"!event cancel\""+"```");

                else 
                {
                    currentEvent = new Event();
                    currentEvent.userId = message.author.id;
                    currentEvent.serverId = message.guild.id;

                    tempEventsArray.push(currentEvent); 
                }
                break;

            case "edit":        // edit mode
                if (currentEvent !== null)
                    message.channel.send("```"+"Failure: There is an unsaved event. Use \"!event confirm\" or \"!event cancel\""+"```");
                
                else if (isNaN(args[1]))
                {
                    message.channel.send(invalid);
                }
                else 
                {
                    currentEvent = await database.getEvent(args[1]);
                    console.log(currentEvent);
                    if (currentEvent === null)
                    {
                        message.channel.send("```"+`Failure: There is no such event ID ${args[1]}`+"```");
                    }
                    else 
                    {
                        tempEventsArray.push(currentEvent);  
                        currentEvent.ownerId = currentEvent.userId;         // save the previous id in ownerId 
                        currentEvent.userId = message.author.id;
                    }

                }
                break;
                
            case "list":    // list mode
                const eventArray = await database.listEvent();
                let result = "";

                if (eventArray === null)
                    message.channel.send("```"+`No Events.`+"```");
                else 
                {
                    for (let element of eventArray)
                    {
                        result += element.toString();
                        result += '\n';
                    }
                    message.channel.send("```"+`${result}`+"```");
                }
                break;

            case "delete":      // delete mode
                if (isNaN(args[1]))
                    message.channel.send(invalid);
                else if (await database.deleteEvent(args[1]) === true)
                {
                    message.channel.send("```Deleted an event!```");
                }
                else 
                {
                    message.channel.send("```The event ID is invalid!```");
                }
                break;

            case "name":        
                currentEvent.name = args.slice(1).join(' ');   // assign name
                break;

            case "description":     
                currentEvent.description = args.slice(1).join(' ');    // assign description
                break;

            case "start":
                currentEvent.startTime = (new Date(args[1] + "-05:00")).getTime(); // estern time
                break;

            case "end":
                currentEvent.endTime = (new Date(args[1] + "-05:00")).getTime();   // estern time
                break;                

            case "url":
                currentEvent.url = (args[1]);   // assign url
                break;

            case "permission":
                if (!isNaN(args[1]))
                {
                    currentEvent.permission = (Number(args[1]));   // assign permission
                }
                break;

            case "review":
                message.channel.send("```"+currentEvent.toString()+"```");
                break;

            case "confirm":
                // event must have a name
                if (currentEvent.name === undefined)
                {
                    message.channel.send("```Event must have a name```");
                }
                else 
                {      
                    if (currentEvent.ownerId !== undefined)
                        currentEvent.userId = currentEvent.ownerId;

                    currentEvent.fillBlank();       // fill in empty properties
                    if (await database.editEvent(currentEvent) === false)
                    {
                        message.channel.send("```Failure in submitting event```");
                        break;
                    }
                    else 
                    {
                        message.channel.send("```Submitted an event!```");
                    }
                     
                }
                    
            case "cancel":
                // remove the temporary event entry
                tempEventsArray.splice(tempEventsArray.indexOf(currentEvent), 1);
                console.log(tempEventsArray);
                break;

            default:
                break;
            }
        
        }

    }

 
    // event ends
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // reminder functions
    if (cmd === `${prefix}CreateReminder`)
    {
        let reminder;

        if (args[0] === undefined || args[1] === undefined || isNaN(args[0]) ) 
        {
            message.channel.send(invalid);
        }
        else if (await database.getEvent(args[0]) === null)
        {
            message.channel.send("```"+`Invalid Event ID!`+"```");
        }
        else 
        {
            reminder = new Reminder(args[0], (new Date(args[1] + "-05:00")).getTime());
            if (args[2] !== undefined) // info is optional
            {
                reminder.info = args.slice(2).join(' ');
            }
            console.log(reminder);
            
            if (await database.createReminder(reminder) === true)
            {
                 message.channel.send("```"+`Created a reminder!`+"```");
            }
            else
            {
                 message.channel.send("```"+`Failure: to create a reminder!`+"```");
            }
        }
    }

    // list reminders
    if (cmd === `${prefix}ListReminder`)
    {
        const remArray = await database.listReminder();
        let result = "";

        if (remArray === null)
            message.channel.send("```"+`No Reminder.`+"```");
        else 
        {
             for (let element of remArray)
            {
                result += element.toString();
                result += '\n';
            }
            message.channel.send("```"+`${result}`+"```");
        }
    }

    // delete Reminder
    if (cmd === `${prefix}DeleteReminder`)
    {
        if (args[0] === undefined || isNaN(args[0]))
            message.channel.send(invalid);
        else if (await database.deleteReminder(args[0]) === true)
        {            
            message.channel.send("```"+`Deleted a reminder!`+"```");  
        }
        else 
        {
            message.channel.send("```"+`Invalid Reminder ID!`+"```"); 
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // list subscriptions
    if (cmd === `${prefix}ListSubscription`)
    {
        const subArray = await database.listSub();
        let result = "";

        if (subArray === null)
            message.channel.send("```"+`No Subscriptions.`+"```");
        else 
        {
            result = "Subscriptions:\n";
             for (let element of subArray)
            {
                result += element.toString();
                result += '\n';
            }
            message.channel.send("```"+`${result}`+"```");
        }
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //testing database features below...

    //Here, I created a couple of test tables because I did not know what program to use to access our database (Will ask)
    if (cmd === `${prefix}cTestDatabase`){

        let q = 'CREATE TABLE TEST_EVENT (EVENT_ID SERIAL NOT NULL PRIMARY KEY, EVENT_NAME VARCHAR(100) NOT NULL);'
        q += ' CREATE TABLE TEST_USER (USER_TAG TEXT PRIMARY KEY); CREATE TABLE TEST_SUBSCRIPTION (EVENT_ID INTEGER REFERENCES TEST_EVENT(EVENT_ID), USER_TAG TEXT REFERENCES TEST_USER(USER_TAG), PRIMARY KEY (EVENT_ID, USER_TAG));'
        q += ' CREATE TABLE TEST_ADVERTISEMENT (EVENT_ID INTEGER REFERENCES TEST_EVENT(EVENT_ID), ADVERT_SERVER TEXT NOT NULL, ADVERT_MESSAGE TEXT, PRIMARY KEY (EVENT_ID));'
        
        pool.query(q, (err, res) => {
            //does this work? (yes)
            if(err) {
                throw err;
            }
            else{
                message.channel.send("```Test Tables created```");
            }
        });
    }

    //This is a very very preliminary "create event" type of function.
    //We will eventually need more information in events, but this was just for testing.
    //There were some issues, hence all the text that is sent. Works now.

    //TODO: Pack this up into its clean method, validate input in terms of name (and other variables, as necessary),
    //Maybe hand over information to a database object we create?
    if (cmd === `${prefix}CreateEvent`){
        let name = args[0];

        message.channel.send(name);
        message.channel.send("```Pre-attempt```");
        
        message.channel.send("```Attempting...```");

        pool.query(`INSERT INTO TEST_EVENT (EVENT_NAME) VALUES (\'${name}\');`, (err, res) => {
            if(err) {
                throw err;
            }
            else{
                message.channel.send("```No error creating```");
            }
        });

    }

    //This was also made for my testing purposes, just to make sure that the surrogate primary key was working, mostly.
    //Was basically just the old database code fitted to my test tables.
    if(cmd === `${prefix}ListEvents`){

        pool.query('SELECT * FROM TEST_EVENT;', (err, res) => {
            if(err) {
                throw err;
            }
          for (let row of res.rows) {
            message.channel.send(JSON.stringify(row));
          }
          
        });
    }

    //This creates an advertisement for an event in the TEST_ADVERTISEMENT table.
    //This also creates the initial reaction for said event.
    if(cmd === `${prefix}AdvertiseEvent`){
        let eventID = args[0];
        let eventName;
        let messageID;
        let serverID;
        
        /*
        //originally, I planned to break all of this up. However, there's some kind of scope issue? I might be able to resolve this if I knew more javascript, but alas...
        pool.query(`SELECT EVENT_NAME FROM TEST_EVENT WHERE EVENT_ID = ${Number(eventID)};`, (err, res) => {
            if(err) throw err;
            eventName = Object.values(res.rows[0])[0];

            //This sends our initial advertisement message (which should eventually be a lot more!), and then does a bunch of stuff when it has been sent.
            message.channel.send(eventName).then(value => {
                messageID = value.id;
                value.react('🤔')
                serverID = message.guild.id
   
                pool.query(`INSERT INTO TEST_ADVERTISEMENT VALUES (${eventID}, \'${serverID}\', \'${messageID}\');`, (err, res) => {
                    if(err) throw err;
                });
            });
        });
        */
       
        //second version       
        eventName = (await database.getEvent(Number(eventID))).name; 
        
        message.channel.send("```Click the emoji below to subscribe to the event: \n" + eventName + "```").then(value => {
            messageID = value.id;
            value.react('🤔')
            serverID = message.guild.id
            
            database.createAdvert(new Advertisement(messageID, eventID, serverID));
        });
        
    }

    //Used to debug the TEST_ADVERTISEMENT table.
    if(cmd === `${prefix}ShowAdverts`){

        pool.query('SELECT * FROM TEST_ADVERTISEMENT;', (err, res) => {
            if(err) {
                throw err;
            }
            for (let row of res.rows) {
                message.channel.send("```"+JSON.stringify(row)+"```");
            }
          
        });
    }
   
});

client.on('messageReactionAdd', async (reaction, user) => {
    
    let advert;
    //The proceeding block will determine whether the message has been cached, and if not, will cache it.
    //Otherwise, reactions won't be properly responded to!
    if(reaction.partial){
        try{
            await reaction.fetch();
        }catch(error){
            console.error("Error fetching message: ", error);
            return;
        }
    }

    //This determines whether a bot is making the call, and whether the correct emoji is being used. (We can change that later)
    if(!(user.bot) && (reaction.emoji.name == '🤔')){
        
        //TODO: figure out if the message being reacted to corresponds to an advertised event via query.
        console.log(reaction.message.id);
        advert = await database.getAdvert(reaction.message.id);
        console.log(user.id);
        console.log(advert);
  
        database.createSub(new Subscription(user.id, advert.eventId));
    }
});



// do not touch this. this is how our bot links to our code from discord. 
// the TOKEN variable is set in Heroku so the key is not on GitHub
client.login(process.env.TOKEN);

