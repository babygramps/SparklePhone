const dotenv = require('dotenv');
dotenv.config();
const token = process.env.SLACK_ACCESS_TOKEN;
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const slack = require('slack');
const functions = require('../useful-functions/funfunfunctions');
const filterByListSubscribed = functions.filterByListSubscribed;
const filterOptedInUsers = functions.filterOptedInUsers;
const getUsers = require('../db/googlesheets');

const sendMessage = require('../message-senders/message-routing');

const approvedSendChannel = 'GGXPDR9SQ';


router.post('/', (req, res) =>{
    const body = req.body;
    const payload = body.payload;
    const parsedPayload = JSON.parse(payload);
    const messageSentFromChannel = parsedPayload.channel.id
    const listName = parsedPayload.submission.list
    const message = parsedPayload.submission.message

    if (messageSentFromChannel == approvedSendChannel) {
        getUsers()
        .then(returnedUsers => {
            let subscribedUsers = filterByListSubscribed(returnedUsers, listName);
            let optedInUsers = filterOptedInUsers(subscribedUsers);
            if (optedInUsers.length > 0) {
                optedInUsers.forEach(user => sendMessage(user, message))
                slack.im.open({
                    token: token,
                    user: parsedPayload.user.id,
                    return_im: true
                    })
                .then(response => {
                    slack.chat.postEphemeral(messageBody(token, response.channel.id, '⏱ Message sending....', parsedPayload.user.id))
                    console.log(response);
                })
                .then(response => {
                    slack.chat.postMessage(messageBody(token, parsedPayload.user.id, '🤠 Hoozah! Message sent.'))
                })
                res.status(200).end();
            } else {
                slack.im.open({
                    token: token,
                    user: parsedPayload.user.id
                    })
                .then(response => {
                    slack.chat.postEphemeral(messageBody(token, response.channel.id, ` 😖 Shucks, no one opted in on that list, so the message didn't make it to anyone`, parsedPayload.user.id))
                    res.status(200).end();
                })
            }
        })
        .catch(err => console.error(err));
    } else {
        slack.im.open({
            token: token,
            user: parsedPayload.user.id
            })
            .then(response => {
                console.log(response);
                slack.chat.postMessage(messageBody(token, parsedPayload.user.id, `Tisk tisk now, you can't use /list in that channel`));
            })
        console.log(`someone named ${parsedPayload.user.name} tried to access /list without proper permission in ${messageSentFromChannel}`);
    }
})

function messageBody(token, channel, text, user){
    let body = {
        token: token,
        channel: channel,
        text: text,
        as_user: true,
        user: user
    }
    return body;
}

module.exports = router;