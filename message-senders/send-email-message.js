const nodemailer = require('nodemailer');
const emailUsername = 'pocolypz@gmail.com';
const emailPassword = 'yimntccbizilkfdi';

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: emailUsername,
           pass: emailPassword
       }
   });

function sendEmailMessage(user, messageBody){
    var mailOptions = {
        from: emailUsername, // sender address
        to: user.config, // list of receivers
        subject: 'there\'s a new announcement from SparklePhone 📣', // Subject line
        html:   `<h3>Hey ${user.firstname}, here's the latest update from Sparkle Donkey Village:</h3>
                <br> 
                <p>${messageBody} </p>`
      };
    transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
 });
}

module.exports = sendEmailMessage;

