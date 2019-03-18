const GoogleSpreadsheet   = require('google-spreadsheet');
const creds               = require('./client-secret.json');
const doc                 = new GoogleSpreadsheet('1TJwqiJAawPQOLBo6Na5hDEBcUp8MoioirxvwA4TRD7Y');

var users = [];

doc.useServiceAccountAuth(creds, function (err) {   
    doc.getRows(1, function (err, rows) {
        rows.forEach(function (user){
           users.push({
                firstname : user.firstname,
                lastname : user.lastname,
                preferred : user.preferred,
                to : user.config,
                optIn: user.optin
                });
            });
        });
});
    
    module.exports = users;