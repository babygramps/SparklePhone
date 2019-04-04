const dotenv = require('dotenv');
dotenv.config();

const nodemailer = require('nodemailer');
const emailUsername = process.env.FROM_EMAIL;
const emailPassword = process.env.FROM_EMAIL_PASSWORD;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: emailUsername,
           pass: emailPassword
       }
   });

async function sendEmailMessage(user, messageBody){
    var mailOptions = {
        from: emailUsername, // sender address
        to: user.config, // list of receivers
        subject: `There's a new announcement from SparklePhone 📣`, // Subject line
        html:   `<h3>Hey ${user.firstname}, here's the latest update from ${user.list}:</h3>
                <br> 
                <p>${messageBody} </p>`
      };
      const mailSent = await transporter.sendMail(mailOptions); // send the message and await the response from Gmail
      mailSent.method = 'email'
      mailSent.user = user.config
      if (mailSent.accepted.length > 0) {
        mailSent.result = true
      } else {
        mailSent.result = false
      }
      return mailSent;
}

module.exports = sendEmailMessage;

