const sendSlackMessage = require('../message-senders/send-slack-message');
const sendSmsMessage = require('../message-senders/send-sms-message');
const sendEmailMessage = require('../message-senders/send-email-message');    
const sendFacebookMessage = require('../message-senders/send-fb-message');

function sendMessage(user, messageBody) {
    switch(user.preferred) {
        case preferred = 'Slack': 
            return sendSlackMessage(user, messageBody);
        case preferred = 'Email':
            return sendEmailMessage(user, messageBody);
        case preferred = 'Phone':
           return sendSmsMessage.sendSmsMessage(user, messageBody)
        case preferred = 'Facebook':
            return sendFacebookMessage(user, messageBody);
        default:
            console.log(`Encountered unknown preference: ${user.preferred}`);
    }
}

module.exports = sendMessage;