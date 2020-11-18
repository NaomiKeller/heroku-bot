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
    
    if (cmd === `${prefix}database`)
    {
        pool.connect();

        pool.query('SELECT * FROM event;', (err, res) => {
          if (err) throw err;
          for (let row of res.rows) {
            message.channel.send(JSON.stringify(row));
          }
          
        });
        pool.end();  
    }

    //testing below...
    
    if (cmd === `${prefix}cTestDatabase`){
        pool.connect();

        pool.query('CREATE TABLE TEST_EVENT (EVENT_ID SERIAL NOT NULL PRIMARY KEY, EVENT_NAME VARCHAR(100) NOT NULL); CREATE TABLE TEST_USER (USER_TAG TEXT PRIMARY KEY); CREATE TABLE TEST_SUBSCRIPTION (EVENT_ID INTEGER REFERENCES TEST_EVENT(EVENT_ID), USER_TAG TEXT REFERENCES TEST_USER(USER_TAG), PRIMARY KEY(EVENT_ID, USER_TAG));', (err, res) => {
            //does this work?
            if(err) throw err;
            else{
                message.channel.send("Test Tables created");
            }
        });
    }

    if (cmd === `${prefix}CreateEvent`){
        let name = args[0];

        pool.connect();
        pool.query(`INSERT INTO TEST_EVENT VALUES (DEFAULT, ${name});`, (err, res) => {
            if(err) throw err;
            else{
                message.channel.send("Event created with values: ");
                pool.query(`SELECT * FROM TEST_EVENT WHERE EVENT_NAME = \'${name}\'`, (err, res) => {
                    if(err) throw err;
                    else{
                        for(let row of res.rows){
                            message.channel.send(JSON.stringify(row));
                        }
                    }
                });
            }
        });
    }
   
});

// do not touch this. this is how our bot links to our code from discord. 
// the TOKEN variable is set in Heroku so the key is not on GitHub
client.login(process.env.TOKEN);








