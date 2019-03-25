function filterOptedInUsers(users){
    const optedIn = users.filter((camper) => camper.optin === true);
    return optedIn;
}

 function filterByListSubscribed(users, listName){
     const Subscribed = users.filter((user) => user.list === listName);
     return Subscribed;
}

exports.filterOptedInUsers = filterOptedInUsers;
exports.filterByListSubscribed = filterByListSubscribed;