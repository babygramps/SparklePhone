const dotenv = require('dotenv');
dotenv.config();
const token = process.env.SLACK_ACCESS_TOKEN;
const { WebClient } = require('@slack/client');
const web = new WebClient(token);

async function sendSlackMessage(user, messageBody) {
  const open = await web.im.open({
    token: token,
    user: user.config
  });
  const message = await web.chat.postMessage({
    channel: open.channel.id,
    text: messageBody,
    token: token
  });
  
  return {
    result: message.ok,
    method: 'slack',
    user: user.config
  };
}

module.exports = sendSlackMessage;
