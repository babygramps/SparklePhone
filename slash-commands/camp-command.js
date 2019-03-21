const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter('8506cf783cdb22de20da83f21fcced39'); // Initialize using signing secret from environment variables
app.use('/slack/events', slackEvents.expressMiddleware());
app.use(bodyParser.urlencoded({extended: true})); // MUST be after Slack middleware

const users = require('../db/googlesheets');

app.post('/slack/camp', (req, res) => {
    const filteredCampers = [];
    const messageBody = req.body.text
    // let campName = text.substr(0, text.indexOf(' '));
    // console.log(campName);
    
    users.filter((user) => {
        if (user.optIn === 'TRUE'){
            filteredCampers.push(user);
        }
    });
    // console.log(filteredCampers);
    filteredCampers.forEach((user) => {
        if (user.camp === "Miso"){
            sendMessage(user, messageBody);
            // console.log(text);
        }
    })
});

module.exports = slash;