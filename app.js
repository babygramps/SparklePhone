/*======================================================================
                            INITIALIZE
======================================================================*/ 

// Set up Express to work with ngrok, slash commands, and the POST route from https://api.slack.com/apps/AGK0PCC12/event-subscriptions?
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// Dependencies
const preferences = require('./preferences');
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
                SEND MESSAGES POSTED TO #MESSAGE-BLASTING
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

slackEvents.on('message', (event)=> {
    if(event.channel === 'GGXPDR9SQ' && !event.subtype){
        getUsers()
        .then(response => {
            response.forEach((user)=> {
                if (user.optin === 'TRUE'){
                    sendMessage(user, event.text);
                }
            });
        })
        
    }
});

// function isOptedIn(){
//    users.filter(user => {
//        if (user.opt === 'TRUE'){
//             return user;
//         }
//     });
// }

// function isUserInCamp(campName){
//     users.filter(user => {
//         if(user.camp === campName){
//             return user;
//         }
//     });
// }

/*======================================================================
                    SEND SLASH COMMANDS
======================================================================*/  

app.post('/slack/camp', (req, res) => {
    const messageBody = req.body.text
    const campName = messageBody.substr(0, messageBody.indexOf(' '));
    const message = messageBody.split(campName+" ")[1];
    
    // users
    // .filter(isOptedIn(isUserInCamp));

     if (req.body.channel_id == 'GGXPDR9SQ') {
        users.filter((user) => {
            if (user.optIn === 'TRUE' && user.camp === campName){
                filteredCampers.push(user);
            }
        });
    
        filteredCampers.forEach((user) => {
                sendMessage(user, message);
        });
        console.log(`some dumb fuck named ${req.body.user_name} tried to access /camp without proper permission in ${req.body.channel_name}`);
    } 
});


// Start the server and open port 80 locally for ngrok
app.listen(80, function(){
    console.log('server has started.....');
});