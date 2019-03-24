const GoogleSpreadsheet     = require('google-spreadsheet');
const creds                 = require('./client-secret.json');
const util             = require('util');

async function getUsers(){
    const doc = await new GoogleSpreadsheet('1TJwqiJAawPQOLBo6Na5hDEBcUp8MoioirxvwA4TRD7Y');
    await util.promisify(doc.useServiceAccountAuth)(creds);
    const users = await util.promisify(doc.getRows)(1);
    const optinToBoolean = users.map((user) => {
        if (user.optin === `TRUE`) {
            user.optin = true;
        } else if (user.optin === 'FALSE') {
            user.optin = false;
        }
        return user;
    });
    return optinToBoolean;
}

    module.exports = getUsers;