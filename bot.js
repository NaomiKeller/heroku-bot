const Discord = require('discord.js');
const config = require("./config.json");
const { Pool } = require ('pg');    
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


const Database = require('./database.js');
const database = new Database.Database();

const tempEvent = new Database.Event();

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.on('ready', () => {
    console.log('I am ready!');
    client.user.setActivity("Don't forget!"); // "Playing <>" status message for bot

    

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
    let helpArray = ["!blip"," !date", " !site"]; // List of available commands

    if (cmd === `${prefix}blip`) {
        return message.channel.send("blap");
    }

    if (cmd === `${prefix}date`) {
        return message.channel.send(`${d}`);

    }

    if (cmd === `${prefix}help`) {
        return message.channel.send("Available commands: " + `${helpArray}`);
    }

    if (cmd === `${prefix}site`) {
        return message.channel.send("https://testing-dis-bot.herokuapp.com");
    }

    if (cmd === `${prefix}test`) {
       
    }
    
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // event editor:
    // 
    if (cmd === `${prefix}event`) {
   
        switch (args[0])
        {
            case "create":
                let newName = args.slice(1).join(' ');
                tempEvent.name = newName;
                break;

            case "start":
                let start = new Date(args[1]);
                tempEvent.startTime = start.getTime();
                break;

            case "end":
                let end = new Date(args[1]);
                tempEvent.endTime = end.getTime();
                break;

            case "review":
                message.channel.send(tempEvent.toString());
                break;

            case "confirm":
                console.log(tempEvent);
                if (tempEvent.name === undefined || tempEvent.startTime === undefined || tempEvent.end === undefined)
                {
                    message.channel.send(`Event name, start time and end time must be provided!`);
                    break;
                }
                else 
                {
                    
                    database.createEvent(tempEvent); 
                    console.log("Create an Event");
                }
                
            case "cancel":
                    Object.keys(tempEvent).forEach(function(index) {
                    tempEvent[index] = null;
                });
                break;

            default:
                break;
        }

    }

    // a temp version for list events
    if (cmd === `${prefix}ListEvent`)
    {
        const eventArray = await database.listEvent();
        let result;

        for (let element of eventArray)
        {
            result += element.toString();
            result += '\n';
        }
        message.channel.send(`${result}`);
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
                message.channel.send("Test Tables created");
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
        message.channel.send("Pre-attempt");
        
        message.channel.send("Attempting...");

        pool.query(`INSERT INTO TEST_EVENT (EVENT_NAME) VALUES (\'${name}\');`, (err, res) => {
            if(err) {
                throw err;
            }
            else{
                message.channel.send("No error creating");
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
        
        message.channel.send(eventName).then(value => {
            messageID = value.id;
            value.react('🤔')
            serverID = message.guild.id
   
            database.createAdvert(new Database.Advertisement(messageID, eventID, serverID));
        });
        
    }

    //Used to debug the TEST_ADVERTISEMENT table.
    if(cmd === `${prefix}ShowAdverts`){

        pool.query('SELECT * FROM TEST_ADVERTISEMENT;', (err, res) => {
            if(err) {
                throw err;
            }
            for (let row of res.rows) {
                message.channel.send(JSON.stringify(row));
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
        advert = database.getAdvert(reaction.message.id);
        console.log(user);
        console.log(advert);
  
        database.createSub(user.id, advert.eventId);
    }
});



// do not touch this. this is how our bot links to our code from discord. 
// the TOKEN variable is set in Heroku so the key is not on GitHub
client.login(process.env.TOKEN);

