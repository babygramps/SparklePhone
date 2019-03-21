/*======================================================================
                INITIALIZE
======================================================================*/ 

// Set up Express to work with ngrok, slash commands, and the POST route from https://api.slack.com/apps/AGK0PCC12/event-subscriptions?
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// Dependencies
const preferences = require('./preferences');
const sendSlackMessage = require('./message-senders/send-slack-message').default;
const sendSmsMessage = require('./message-senders/send-sms-message');
const sendEmailMessage = require('./message-senders/send-email-message');
const users = require('./db/googlesheets');

// Required modules to use slackEvents
const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter('8506cf783cdb22de20da83f21fcced39'); // Initialize using signing secret from environment variables
app.use('/slack/events', slackEvents.expressMiddleware());


/*======================================================================
                SEND MESSAGES
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
        users.forEach((user)=> {
            if (user.optIn === 'TRUE'){
                sendMessage(user, event.text);
            }
        });
    }
});

// var filteredCampers = [];

// app.post('/slack/camp', (req, res) => {
//     var text = req.body.text
//     const campName = text.substr(0, text.indexOf(' '));
//         users.filter((user) => {
//             if (user.optIn === 'TRUE'){
//                 filteredCampers.push({user, text});
//             }
//             console.log(filteredCampers);
//         });
// });

// filteredCampers.forEach((user) => {
//     if (user.camp === 'Miso'){
//         sendMessage(user, text);
//     }
// })

// Start the server and open port 80 locally for ngrok
app.listen(80, function(){
    console.log('server has started.....');
});