const dotenv = require('dotenv');
dotenv.config();

const twilio = require('twilio');
const accountSid  = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken   = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const twilioNumber = process.env.TWILIO_NUMBER; // From a valid Twilio number
const client = new twilio(accountSid, authToken);

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

function sendSmsMessage(user, messageBody) {
     client.messages
        .create({
         body: messageBody,
         from: twilioNumber,
         statusCallback: process.env.TWILIO_STATUS_CALLBACK,
         to: user.config
       });

       // create a new promise to return when Twilio POSTS the SMS status
       return new Promise ((resolve, reject) => {
         router.post('/', (req, res) => {
           if (req.body.SmsStatus === 'delivered') {
             resolve({
               result: true,
               method: 'phone',
               user: req.body.To
             })
           } else if (req.body.SmsStatus !== 'sent') {
            resolve({
              result: false,
              method: 'phone',
              user: req.body.To
            })
           } res.sendStatus(200);
         })
       })
}

module.exports = {
  sendSmsMessage : sendSmsMessage,
  router : router
}