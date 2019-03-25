const sendSlackMessage = require('../message-senders/send-slack-message');
const sendSmsMessage = require('../message-senders/send-sms-message');
const sendEmailMessage = require('../message-senders/send-email-message');    

function sendMessage(user, messageBody) {
    switch(user.preferred) {
        case preferred = 'Slack':
            sendSlackMessage(user, messageBody);
            break;
        case preferred = 'Phone':
            sendSmsMessage(user, messageBody);
            break;
        case preferred = 'Email':
            sendEmailMessage(user, messageBody);
            break;
        default:
            console.log(`Encountered unknown preference: ${user.preferred}`);
    }
}

module.exports = sendMessage;