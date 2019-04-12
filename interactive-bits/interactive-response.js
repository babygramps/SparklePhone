const dotenv = require('dotenv');
dotenv.config();

const token = process.env.SLACK_ACCESS_TOKEN;
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const slack = require('slack');

const sparklePhone = require('../useful-functions/index');
const getUsers = require('../db/googlesheets');

const sendMessage = require('../message-senders/message-routing');

const approvedSendChannel = process.env.SLACK_CHANNEL;

router.post('/', async function (req, res){
    res.status(200).end();
    try {
        const payload = JSON.parse(req.body.payload);
        const messageSentFromChannel = payload.channel.id
        const listName = payload.submission.list
        const message = payload.submission.message

        if (messageSentFromChannel == approvedSendChannel) {
            const users = await getUsers();
            const subscribedUsers = sparklePhone.filteringFunctions.filterByListName(listName, users);
            const optedInUsers = sparklePhone.filteringFunctions.filterByCriteria(subscribedUsers,'optin', true);
            
            if (optedInUsers.length > 0) {
                let opened = await slack.im.open({token: token, user: payload.user.id, return_im: true}); // Open slack channel with initial sender
                slack.chat.postEphemeral(sparklePhone.objectFormattingFunctions.messageBody(token, opened.channel.id, '⏱ Message sending....', payload.user.id)); // Send 'sending' message
                const messageSendPromiseArray = optedInUsers.map((user) => sendMessage(user, message)); // Send messages to users and return promises
                Promise.all(messageSendPromiseArray)
                .then(promises => sparklePhone.objectFormattingFunctions.createLog(promises, payload.user.id)) // Send status/log message to initial user
                .then(() => slack.chat.postMessage(sparklePhone.objectFormattingFunctions.messageBody(token, payload.user.id, '🤠 Hoozah! Message sent.')));
            } else {
                let opened = await slack.im.open({token: token, user: payload.user.id, return_im: true});
                slack.chat.postEphemeral(sparklePhone.objectFormattingFunctions(token, opened.channel.id, ` 😖 Shucks, no one opted in on that list, so the message didn't make it to anyone`, payload.user.id))
                res.status(200).end();
            }
        } else {
            await slack.im.open({token: token, user: payload.user.id})
            slack.chat.postMessage(sparklePhone.objectFormattingFunctions(token, payload.user.id, `Tisk tisk now, you can't use /list in that channel`));
        }
    }
    catch(err){console.log(err)};
})

module.exports = router;