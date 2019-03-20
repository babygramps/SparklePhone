const token = 'xoxb-327372090452-562492725825-w586krhfsroHmaNGcFJJpWTz'
const { WebClient } = require('@slack/client');
const web = new WebClient(token);

function sendSlackMessage(user, messageBody) {
  web.im.open({
    token: token,
    user: user.to
  })
  .then((response) => {
    if (response.ok === true) {
      web.chat.postMessage({
        channel: response.channel.id,
        text: messageBody,
        as_user: false,
        icon_emoji: ':carousel_horse:'
      })
    } else {
      console.log(`A whoopsie was found for user ${user.to}: ${response.error}`);
    }
  });
}

module.exports = sendSlackMessage;
