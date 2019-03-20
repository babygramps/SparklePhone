// Set up Express to work with ngrok and the POST route from https://api.slack.com/apps/AGK0PCC12/event-subscriptions?
const express = require('express');
const app = express();

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

// ES6 import and export isn't fully supported in node quite yet, currently it's experimental

/* import preferences from './preferences';
import sendSlackMessage from './message-senders/send-slack-message.js';
import sendSmsMessage from './message-senders/send-sms-message.js'; */


// Use switch/case to send event.text from slack message payload to preferred contact methods
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
        // Array.map didn't work here, kept getting: "ReferenceError: user is not defined". Went with a trusty ol' array.forEach
        // users.map(user => sendMessage(user));

        users.forEach((user)=> {
            if (user.optIn === 'TRUE'){
                sendMessage(user, event.text);
            }
        });
    }
});

// Start the server and open port 80 locally for ngrok
app.listen(80, function(){
    console.log('server has started.....');
});