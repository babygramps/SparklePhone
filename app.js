/*======================================================================
                            INITIALIZE
======================================================================*/ 

// Set up Express to work with ngrok, slash commands, and the POST route from https://api.slack.com/apps/AGK0PCC12/event-subscriptions?
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// Dependencies
const sendSlackMessage = require('./message-senders/send-slack-message');
const sendSmsMessage = require('./message-senders/send-sms-message');
const sendEmailMessage = require('./message-senders/send-email-message');
const getUsers = require('./db/googlesheets');

// Required modules to use slackEvents
const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter('8506cf783cdb22de20da83f21fcced39'); // Initialize using signing secret from environment variables
app.use('/slack/events', slackEvents.expressMiddleware());
app.use(bodyParser.urlencoded({extended: true})); // MUST be after Slack middleware


/*======================================================================
                    🤖  MESSAGE ROUTING  🤖 
======================================================================*/    

function sendMessage(user, messageBody) {
    switch(user.preferred) {
        case preferred = 'Slack':
            sendSlackMessage(user, messageBody);
            break;
        case preferred = 'Phone':
            sendSmsMessage(user, messageBody);
            break;
        case preferred = 'Email':
            sendEmailMessage(user, messageBody);
            break;
        default:
            console.log(`Encountered unknown preference: ${user.preferred}`);
    }
}

/*======================================================================
                🤑 SEND ALL MESSAGES POSTED TO #MESSAGE-BLASTING 🤑
======================================================================*/

// The channel that triggers our messages. Maybe we want this to be changed programmatically?
const approvedSendChannel = 'GGXPDR9SQ';

slackEvents.on('message', (slackMessage)=> {
    if(slackMessage.channel === approvedSendChannel && !slackMessage.subtype){
        getUsers()
        .then((returnedUsers) => filterOptedInUsers(returnedUsers))
        .then((optedInUsers) => {
            optedInUsers.forEach(user => sendMessage(user, slackMessage.text))
        });
    }
});

/*======================================================================
                     😱  SEND SLASH COMMANDS  😱 
======================================================================*/  

app.post('/slack/list', (req, res) => {
    const requestBody = req.body;
    const messageBody = requestBody.text;
    const listName = messageBody.substr(0, messageBody.indexOf(' '));
    const message = messageBody.split(listName+" ")[1];
    const messageSentFromChannel = requestBody.channel_id;

     if (messageSentFromChannel == approvedSendChannel) {
        getUsers()
        .then(returnedUsers => {
            let subscribedUsers = filterByListSubscribed(returnedUsers, listName);
            let optedInUsers = filterOptedInUsers(subscribedUsers);
            if (optedInUsers.length === 0) {
                res.send(`🤔 Hmmm.... there's no list called ${listName}`);
            }
            optedInUsers.forEach(user => sendMessage(user, message))
            res.send(`😍 Good job! Your message made it to everyone in the ${listName} list!`);
        })
        .catch(err => console.error(err));
    } else {
        console.log(`someone named ${requestBody.user_name} tried to access /list without proper permission in ${requestBody.channel_name}`);
    }
});

/*======================================================================
                    🙃 FUN FUN FUNCTIONS 🙃
======================================================================*/    

function filterOptedInUsers(users){
    const optedIn = users.filter((camper) => camper.optin === true);
    return optedIn;
}

 function filterByListSubscribed(users, listName){
     const Subscribed = users.filter((user) => user.list === listName);
     return Subscribed;
}

// Start the server and open port 80 locally for ngrok
app.listen(80, function(){
    console.log('🚀 SparklePhone has blasted off Captain!...... 🚀');
});