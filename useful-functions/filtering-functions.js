const filteringFunctions = {
// Create an array of users who are opted in
    filterOptedInUsers: function (users){
        const optedIn = users.filter((camper) => camper.optin === true);
        return optedIn;
    },

    // Create an array of users by lists subscribed
    filterByListSubscribed: function (users, listName){
        const Subscribed = users.filter((user) => user.list === listName);
     return Subscribed;
    }
};

module.exports = filteringFunctions;