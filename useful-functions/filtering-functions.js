let users = [
    {
        user: 'rick',
        method: 'slack',
        optin: true,
        list: 'placement, space, something'
    },
    {
        user: 'james',
        method: 'phone',
        optin: false,
        list: 'placement, space, blackhole'
    },
    {
        user: 'bigboy',
        method: 'email',
        optin: true,
        list: 'ketamine, placement'
    },
]

users.map(user => user.list = user.list.split(', '))

console.log(JSON.stringify(users))

const filteringFunctions = {

    filterByCriteria: function (users, criteria, condition){
        return users.filter((camper) => camper[criteria] === condition);
    },
    
    // Why can't includes find user[property]????
    
    filterByListName : function (array, property, listName){
        return array.filter((user) => {
            return user[property].includes(listName)
        })
    }

};

let dock = filteringFunctions.filterByListName(users, 'list', 'space');

const placement = filteringFunctions.filterByCriteria(dock, 'optin', true);
// const optedIn = filteringFunctions.filterByCriteria(placement, 'optin', true);

// const list = filteringFunctions.filteredIn(optedIn, 'list', 'ketamine')


module.exports = filteringFunctions;