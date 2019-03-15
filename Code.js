var botToken = 'xoxb-327372090452-577766917028-0TmMJN4oUUpc8zom7fmVvdpk';

function createMenu() {
  var html = HtmlService.createHtmlOutputFromFile('page')
      .setTitle('SparklePhone')
      .setWidth(300);
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showSidebar(html);
}

function makeQueryStringWithObj(obj) {
  return Object.keys(obj).reduce(function(p, e, i) {
    return p + (i == 0 ? "?" : "&") +
      (Array.isArray(obj[e]) ? obj[e].reduce(function(str, f, j) {
        return str + e + "=" + encodeURIComponent(f) + (j != obj[e].length - 1 ? "&" : "")
      },"") : e + "=" + encodeURIComponent(obj[e]));
  },"");
}

function sendMessage() {
  sendSlackMessage('UA5FFN4SD');
}

function sendSlackMessage(slackUserId) {
  var channelId = openSlackIMForUser(slackUserId);
  var success = sendSlackMessageToChannel('Why you birth me? Now I know how to feel and all I feel is pain', channelId);
}

// API doc: https://api.slack.com/methods/im.open
function openSlackIMForUser(user) {
  var queryString = makeQueryStringWithObj({
    token: botToken,
    user: user
  });
  var options = {
    'method' : 'post',
    'contentType': 'application/json; charset=utf-8',
  };
  var response = UrlFetchApp.fetch('https://slack.com/api/im.open' + queryString, options);
  return JSON.parse(response.getContentText("UTF-8")).channel.id;
}

// API doc: https://api.slack.com/methods/chat.postMessage
// NOTE: postMessage is rate limitted to 1s/message/channel
function sendSlackMessageToChannel(message, channelId) {
  var queryString = makeQueryStringWithObj({
    token: botToken,
    channel: channelId,
    text: message,
    as_user: false,
    username: 'SparklePhone'
  })
  var options = {
    'method' : 'post',
    'contentType': 'application/json; charset=utf-8',
  };
  var response = UrlFetchApp.fetch('https://slack.com/api/chat.postMessage' + queryString, options);
  return JSON.parse(response.getContentText("UTF-8")).ok;
}