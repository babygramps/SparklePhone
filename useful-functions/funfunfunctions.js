const slack = require('slack');

// Create an array of users who are opted in
function filterOptedInUsers(users){
    const optedIn = users.filter((camper) => camper.optin === true);
    return optedIn;
}

// Create an array of users by lists subscribed
 function filterByListSubscribed(users, listName){
     const Subscribed = users.filter((user) => user.list === listName);
     return Subscribed;
}

// Take an array and add list items for interactive drop down message
function createDialog(text, response){
    // Return lists without duplicates
    const lists = Array.from(new Set(response.map(user => {
        return user.list;
    })))
    lists.forEach(listItem => {
        text.elements[1].options.push({
            label: listItem,
            value: listItem
            })
    });
    return text;
}

function openDialog(dialog, token, triggerId) {
    slack.dialog.open({
        token: token,
        dialog: dialog,
        trigger_id: triggerId
    });
}

exports.filterOptedInUsers = filterOptedInUsers;
exports.filterByListSubscribed = filterByListSubscribed;
exports.createDialog = createDialog;
exports.openDialog = openDialog;