const Discord = require('discord.js');
const config = require("./config.json");
const { Pool } = require ('pg');    
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const client = new Discord.Client();

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
    let helpArray = ["!blip"," !date", " !database", " !site"]; // List of available commands

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

    //testing database features below...

    //Here, I created a couple of test tables because I did not know what program to use to access our database (Will ask)
    if (cmd === `${prefix}cTestDatabase`){

        let q = 'CREATE TABLE TEST_EVENT (EVENT_ID SERIAL NOT NULL PRIMARY KEY, EVENT_NAME VARCHAR(100) NOT NULL);'
        q += ' CREATE TABLE TEST_USER (USER_TAG TEXT PRIMARY KEY); CREATE TABLE TEST_SUBSCRIPTION (EVENT_ID INTEGER REFERENCES TEST_EVENT(EVENT_ID), USER_TAG TEXT REFERENCES TEST_USER(USER_TAG), PRIMARY KEY (EVENT_ID, USER_TAG));'
        q += ' CREATE TABLE TEST_ADVERTISEMENT (EVENT_ID INTEGER REFERENCES TEST_EVENT(EVENT_ID), ADVERT_SERVER TEXT NOT NULL, ADVERT_MESSAGE TEXT, PRIMARY KEY (EVENT_ID));'
        
        pool.query(q, (err, res) => {
            //does this work?
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

    //In progress. I learned how to read the returned Javascript object in order to actually get values, which is dope.
    //From here, I plan to have the bot send a message, note that message's ID (as a string), and alter the
    //TEST_EVENT table's ADSNOWFLAKE field to the message's ID. From there, I will have to set up an event
    //listener that looks for reactions, performs a query in the TEST_EVENT for the event's snowflake,
    //and if it finds a match will create a subscription for that user.

    //A lot of my time spent tonight has been figuring out how these libraries work, but so far things are looking great!
    if(cmd === `${prefix}AdvertiseEvent`){
        let eventID = args[0];
        var eventName;
        let messageID;
        let serverID;

        pool.query(`SELECT EVENT_NAME FROM TEST_EVENT WHERE EVENT_ID = ${Number(eventID)};`, (err, res) => {
            if(err) throw err;
            eventName = Object.values(res.rows[0])[0];
        });

        console.log(eventName);

        /*message.channel.send(eventName).then(value => {
             messageID = value.id;
             serverID = message.guild.id

            /*pool.query(`INSERT INTO TEST_ADVERTISEMENT VALUES (${eventID}, \'${serverID}\', \'${messageID}\');`, (err, res) => {
                if(err) message.channel.send("Query error");
                else message.channel.send("No query error");
            });

            message.channel.send("Advertisement Logged");
            

            message.channel.send(messageID);
            message.channel.send(serverID);*/
        //});
    }

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

// do not touch this. this is how our bot links to our code from discord. 
// the TOKEN variable is set in Heroku so the key is not on GitHub
client.login(process.env.TOKEN);








