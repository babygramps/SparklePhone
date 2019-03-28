const dotenv = require('dotenv');
dotenv.config();
const token = process.env.SLACK_ACCESS_TOKEN;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));




const router = express.Router();

// Useful functions
const functions = require('../useful-functions/funfunfunctions');
const createDialog = functions.createDialog;
const openDialog = functions.openDialog;

// DB and message sending logic
const getUsers = require('../db/googlesheets');


// The channel that triggers our messages. Maybe we want this to be changed programmatically?

router.post('/', (req, res) =>{
        res.status(200).end() // best practice to respond with empty 200 status code
        const body = req.body
        const triggerId = body.trigger_id;

        const skeletonDialog = {
            title: 'Welcome to SparklePhone',
            trigger_id: triggerId,
            callback_id: 'send-list-message',
            submit_label: 'Blastoff!',
            elements: [
              {
                label: 'What do you want to say to your list?',
                type: 'textarea',
                name: 'message',
                value: 'Type yer message'
              },
              {
                label: 'Subscriber List',
                type: 'select',
                name: 'list',
                value: 'All',
                options: [
                ],
              },
            ]
        }

        getUsers()
        .then((response) => {
            const dialogToSend = createDialog(skeletonDialog, response)
            openDialog(dialogToSend, token, triggerId)
        })
});

module.exports = router;
