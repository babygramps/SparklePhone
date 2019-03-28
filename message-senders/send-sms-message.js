const dotenv = require('dotenv');
dotenv.config();

// Twilio set up

// ES6 import and export isn't fully supported in node quite yet, currently it's experimental
// import twilio from 'twilio';
const twilio = require('twilio');
const accountSid  = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken   = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const twilioNumber = process.env.TWILIO_NUMBER; // From a valid Twilio number
const client = new twilio(accountSid, authToken);

// to is the number or email address of the recipient
function sendSmsMessage(user, messageBody) {
  client.messages.create({
    body: `${user.firstname}, there's a new announcement from SparklePhone: ${messageBody}`,
    to: user.config,  // Text these numbers
    from: twilioNumber
  })
  .then((message) => console.log(message.sid));
}

module.exports = sendSmsMessage;

// ES6 import and export isn't fully supported in node quite yet, currently it's experimental
// export default sendSmsMessage;