
// This module is the main thread of the bot 


const Discord = require('discord.js');
const config = require("./config.json");
   

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


//////////////////////////////////////////////////////////////////////////////////////

// when the client is on
client.on('ready', () => {
    console.log('I am ready!');
    client.user.setActivity("Don't forget!"); // "Playing <>" status message for bot

    let remContrl = new Worker("./reminderCtrl.js");    // reminder control thread
    // removed self ping so heroku doesn't shut off
    //let selfPing = new Worker("./selfPing.js");         // self http access thread

});

//////////////////////////////////////////////////////////////////////////////////////

// message handler
client.on("message", async message => {
    
    if (message.author.bot) 
        return;
    if (message.channel.type === "dm") 
        return;


    let prefix = config.prefix; // prefix is '!'. Set in config.json
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let result = "";
    let helpArray = ["!blip", " !site", " !ListEvent", " !event help"]; // List of available commands
    // going to add event command case that includes brief overview of event management commands

    // commands analyzing
    switch (cmd)
    {

        case `${prefix}blip`:
            message.channel.send("```blap```");
            break;

        case `${prefix}help`:
            message.channel.send("Available commands: " + `${helpArray}`);
            break;
        
        case `${prefix}site`:
            message.channel.send("https://forgetmebot.herokuapp.com");
            break;
        
        // event manager
        case `${prefix}event`:
            let currentEvent = checkTempEvent(message.author.id, message.guild.id, tempEventsArray);
        
            if (currentEvent === null && args[0] !== "create" && args[0] !== "edit" && args[0] !== "delete" && args[0] !== "list")
                message.channel.send("```"+"Use command \"!event create\" or \"!event edit [event id]\" first"+"```");
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
                            currentEvent.userId = message.author.id;
                        }

                    }
                    break;
                
                case "list":    // list mode
                    const eventArray = await database.listEvent();         

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
            break;

        // create reminder
        case `${prefix}CreateReminder`:
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
            
                if (await database.createReminder(reminder) === true)
                {
                     message.channel.send("```"+`Created a reminder!`+"```");
                }
                else
                {
                     message.channel.send("```"+`Failure: to create a reminder!`+"```");
                }
            }
            break;

        // list reminders
        case `${prefix}ListReminder`:
            const remArray = await database.listReminder();            

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
            break;

        // delete Reminder
        case `${prefix}DeleteReminder`:
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
            break;

        // advertise event
        case `${prefix}AdvertiseEvent`:
            let eventID = args[0];
            let event;
            let messageID;
            let serverID;
            
            event = await database.getEvent(Number(eventID));
            if (isNaN(eventID) || event === null)
                message.channel.send("```"+`Invalid Event ID!`+"```");
            else 
            {
                message.channel.send("```Click the emoji below to subscribe to the event: \n" + event.name + "```").then(value => {
                    messageID = value.id;
                    value.react('🤔')
                    serverID = message.guild.id
            
                    database.createAdvert(new Advertisement(messageID, eventID, serverID));
                });
            
            }
            break;

        // list subscriptions
        case `${prefix}ListSubscription`:
            const subArray = await database.listSub();
            

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
            break;

        default:
            break;
    }

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////    


// add subscription
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

        advert = await database.getAdvert(reaction.message.id);
        database.createSub(new Subscription(user.id, advert.eventId));
    }
});

// remove subscription
client.on('messageReactionRemove', async (reaction, user) => {
    
    let advert;

    if(reaction.partial){
        try{
            await reaction.fetch();
        }catch(error){
            console.error("Error fetching message: ", error);
            return;
        }
    }

    console.log("trigger remove handler");

    if(!(user.bot) && (reaction.emoji.name == '🤔')){
        
        // get advert first
        advert = await database.getAdvert(reaction.message.id);
        
        // delete subscription
        await database.deleteSub(advert.eventId, user.id);
    }
});


// do not touch this. this is how our bot links to our code from discord. 
// the TOKEN variable is set in Heroku so the key is not on GitHub
client.login(process.env.TOKEN);

