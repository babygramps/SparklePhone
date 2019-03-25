const FBMessenger = require('fb-messenger')
const token = 'EAAP9FuKyUoABAG28eTm5JmCOdgL1wHYEtlwKYZBfuezTVTtJWXUvckMIsPgU0rbJz7m0nDG6OFR1ZCUGy04ZCk8kmvyCXypzxlU1GKwZCARLEBmZCBCuOPomGuZAkyXC9ZAbgmSvuylcrCZAk5BXFoVglL68h7ZCTIZAhrBAZBun1fl0gZDZD';
const messenger = new FBMessenger({token}) // Will always use this page's token for request unless sent on each method
messenger.setToken(token) // Sets the instance token
 
messenger.setNotificationType('REGULAR') // Sets the instance notificationType

async function sendFacebookMessage (user, messageBody) {
try {
    const response = await messenger.sendTextMessage({id: user.to, text: messageBody})
    console.log(response)
  } catch (e) {
    console.error(e)
  }
}

module.exports = sendFacebookMessage;