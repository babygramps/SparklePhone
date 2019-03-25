const GoogleSpreadsheet     = require('google-spreadsheet');
const creds                 = require('./client-secret.json');
const util             = require('util');

async function getUsers(){
    const doc = await new GoogleSpreadsheet('1TJwqiJAawPQOLBo6Na5hDEBcUp8MoioirxvwA4TRD7Y');
    await util.promisify(doc.useServiceAccountAuth)(creds);
    const users = await util.promisify(doc.getRows)(1);

    // Google sheets sends strings only, no booleans
    // Once users are received from the DB, {optin: 'TRUE'} && {optin: 'FALSE'} are coerced to booleans
    const coerceOptinToBoolean = users.map((user) => {
        user.optin = (user.optin === 'TRUE') ? true : false;
        return user;
    });
    return coerceOptinToBoolean;
}

    module.exports = getUsers;