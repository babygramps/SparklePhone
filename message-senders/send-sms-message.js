// Twilio set up

// ES6 import and export isn't fully supported in node quite yet, currently it's experimental
// import twilio from 'twilio';
const twilio = require('twilio');
const accountSid  = 'ACdb9acd6a13adb88640d01c68088b836b'; // Your Account SID from www.twilio.com/console
const authToken   = '48ef9d59d4636b01ddc6dbab074ff6a6';   // Your Auth Token from www.twilio.com/console
const twilioNumber = '+14159158908'; // From a valid Twilio number
const client = new twilio(accountSid, authToken);

// to is the number or email address of the recipient
function sendSmsMessage(user, messageBody) {
  client.messages.create({
    body: `${user.firstname}, there's a new announcement from SparklePhone: ${messageBody}`,
    to: user.to,  // Text these numbers
    from: twilioNumber
  })
  .then((message) => console.log(message.sid));
}

module.exports = sendSmsMessage;

// ES6 import and export isn't fully supported in node quite yet, currently it's experimental
// export default sendSmsMessage;