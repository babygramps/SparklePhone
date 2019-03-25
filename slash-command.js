const express = require('express');
const router =  express.Router();

// Useful functions
const functions = require('./useful-functions/funfunfunctions');
const filterByListSubscribed = functions.filterByListSubscribed;
const filterOptedInUsers = functions.filterOptedInUsers;

// DB and message sending logic
const sendMessage = require('./message-senders/message-routing');
const getUsers = require('./db/googlesheets');


// The channel that triggers our messages. Maybe we want this to be changed programmatically?
const approvedSendChannel = 'GGXPDR9SQ';

router.post('/', (req, res) => {
    const requestBody = req.body;
    const messageBody = requestBody.text;
    const listName = messageBody.substring(0, messageBody.indexOf(' '));
    const message = messageBody.split(listName+" ")[1];
    const messageSentFromChannel = requestBody.channel_id;

     if (messageSentFromChannel == approvedSendChannel) {
        getUsers()
        .then(returnedUsers => {
            let subscribedUsers = filterByListSubscribed(returnedUsers, listName);
            let optedInUsers = filterOptedInUsers(subscribedUsers);
            if (optedInUsers.length !== 0) {
                optedInUsers.forEach(user => sendMessage(user, message))
                res.send(`😍 Good job ${requestBody.user_name}! Your message made it to everyone in the ${listName} list!`);
            } else {
                console.log(`A message was sent from ${requestBody.user_name} to a list called ${listName}, which doesn't exist`)
                res.send(` 😫 Shoot, no one is signed up for a list called "${listName}", so your message wasn't sent. Maybe check your spelling? Lists can only be one word as well. You sent:
                ${res.req.body.text}`);
            }
        })
        .catch(err => console.error(err));
    } else {
        res.send(`🤫 Ha! Nice try. This app can't be used in this channel.`)
        console.log(`someone named ${requestBody.user_name} tried to access /list without proper permission in ${requestBody.channel_name}`);
    }
});

module.exports = router;