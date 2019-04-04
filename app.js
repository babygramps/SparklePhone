const dotenv = require('dotenv');
dotenv.config();

// Set up Express to work with ngrok and slash commands: https://api.slack.com/apps/AGK0PCC12/slash-commands?
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.disable('x-powered-by');

// Dependencies
const slashInteractive = require('./interactive-bits/interactive-receive');
const slashInteractiveReceive = require('./interactive-bits/interactive-response');
const smsStatus = require('./message-senders/send-sms-message');

// Routes
app.use('/smsstatus', smsStatus.router);
app.use('/slack/list', slashInteractive);
app.use('/slack/list/receive', slashInteractiveReceive);

// Start the server and open port 80 locally for ngrok
app.listen(process.env.PORT, function(){
    console.log('🚀 SparklePhone has blasted off Captain!...... 🚀');
});