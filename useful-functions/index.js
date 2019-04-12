const dotenv = require('dotenv');
dotenv.config();

const slack = require('slack');
const token = process.env.SLACK_ACCESS_TOKEN

const objectFormattingFunctions = {

// Take an array and add list items for interactive drop down message
createDialog: function (text, users){

    // remove commas from array.list and return in an array
    const splitArray = users.map(user => user.list = user.list.split(', '))
    // flatten the split array
    const flattened = splitArray.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
    // remove duplicates in the flattened array
    const lists = [...new Set(flattened)]
    // push each element in the flattened, formatted array into drop-down list items
    lists.forEach(listItem => {
        text.elements[1].options.push({
            label: listItem,
            value: listItem
            })
    });
    return text;
    },

    openDialog: function (dialog, token, triggerId) {
        slack.dialog.open({
            token: token,
            dialog: dialog,
            trigger_id: triggerId
        });
    },

    createLog: function (response, fromUser){
        let slackFormat = [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `messages sent to:`
                }
            },
            {
                type: 'section',
                fields: []
            }
        ]
        // remove duplicate elements from user.method
        const sendMethodsWithoutDuplicates = Array.from(new Set(response.map(user => user.method)))
    
        sendMethodsWithoutDuplicates.forEach(method =>{
            switch (method) {
                case 'slack' :
                let slackUsers = response.filter(user => user.method === 'slack')
                modifySlackBlock(method, slackUsers);
                return slack.chat.postMessage({token: token, channel: fromUser, text: 'congrats here\'s a block message', blocks: slackFormat}) // send the message template to the user
                case 'email' : 
                let emailUsers = response.filter(user => user.method === 'email')
                modifySlackBlock(method, emailUsers);
                return slack.chat.postMessage({token: token, channel: fromUser, text: 'congrats here\'s a block message', blocks: slackFormat}) // send the message template to the user
                case 'phone' : 
                let phoneUsers = response.filter(user => user.method === 'phone')
                modifySlackBlock(method, phoneUsers);
                return slack.chat.postMessage({token: token, channel: fromUser, text: 'congrats here\'s a block message', blocks: slackFormat}) // send the message template to the user
                default: 
                console.log('snot rocket')
            }
           
        })
    
        function modifySlackBlock(method, users){
            // make first character uppercase
            slackFormat[0].text.text = '*'+jsUcfirst(`*${method}* messages sent to:`);
            slackFormat[1].fields = [];
            users.forEach(user => {
                slackFormat[1].fields.push(
                    {
                        type: 'plain_text',
                        text: user.user
                    }
                )
            });
            return slackFormat
        }
        function jsUcfirst(string) {
            return string.charAt(1).toUpperCase() + string.slice(2);
            }
    },
}

const filteringFunctions = {

    filterByCriteria: function (users, criteria, condition){
        return users.filter((camper) => camper[criteria] === condition);
    },
    
    filterByListName : function (criteria, array){
        return array.filter(user => {
            return user.list.includes(criteria)
        })
    }

};

module.exports = {
    filteringFunctions: filteringFunctions,
    objectFormattingFunctions: objectFormattingFunctions
}