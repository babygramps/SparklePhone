const token = 'xoxb-327372090452-562492725825-w586krhfsroHmaNGcFJJpWTz'
const { WebClient } = require('@slack/client');
const web = new WebClient(token);

function sendSlackMessage(user, messageBody) {
    (async () => {
      // See: https://api.slack.com/methods/chat.postMessage
      const res = await web.chat.postMessage(
            { 
                channel: user.to, 
                text: messageBody
            }
          );
    
      // `res` contains information about the posted message
      console.log('Message sent: ', res.ts);
    })();
}

module.exports = sendSlackMessage;

// ES6 import and export isn't fully supported in node quite yet, currently it's experimental
// export default sendSlackMessage;