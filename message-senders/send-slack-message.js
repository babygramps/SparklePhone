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
                    as_user: false,
                    icon_emoji: ':carousel_horse:'
                    });
  const userInfo = await web.users.info({
                      token: token,
                      user: user.config
                    });
  console.log(`Awesome! You sent a message to ${userInfo.user.profile.real_name} with this message: "${messageBody}"`);
}

module.exports = sendSlackMessage;
