const dotenv = require('dotenv');
dotenv.config();

const FBMessenger = require('fb-messenger')
const token = process.env.FACEBOOK_TOKEN;
const messenger = new FBMessenger({token}) // Will always use this page's token for request unless sent on each method
messenger.setToken(token) // Sets the instance token

const express = require('express');
const app = express();
 
messenger.setNotificationType('REGULAR') // Sets the instance notificationType



async function sendFacebookMessage (user, messageBody) {
try {
    const response = await messenger.sendTextMessage({id: user.config, text: messageBody, notificationType:'REGULAR', token})
    console.log(response)
  } catch (e) {
    console.error(e)
  }
}

module.exports = sendFacebookMessage;