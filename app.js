// Set up Express to work with ngrok and slash commands: https://api.slack.com/apps/AGK0PCC12/slash-commands?
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

// Dependencies
const slashCommand = require('./slash-command');

// Receive Slash Commands for /list
app.use('/slack/list', slashCommand);

// Start the server and open port 80 locally for ngrok
app.listen(80, function(){
    console.log('🚀 SparklePhone has blasted off Captain!...... 🚀');
});