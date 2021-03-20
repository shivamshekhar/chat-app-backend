const { userTokenMessagingQueueMap } = require("../../config").message;
const { userTokenNameMap } = require('../../config').user;

class Messaging {
    static send(message, friendToken, userToken) {
        userTokenMessagingQueueMap[friendToken] = userTokenMessagingQueueMap[friendToken] || [];
        userTokenMessagingQueueMap[friendToken].push({
            message,
            sentFrom : userTokenNameMap[userToken]
        });
    }

    static poll(userToken) {
        userTokenMessagingQueueMap[userToken] = userTokenMessagingQueueMap[userToken] || [];
        
        let messages = [];

        while(userTokenMessagingQueueMap[userToken].length) {
            let m = userTokenMessagingQueueMap[userToken].shift();
            messages.push(m);
        }

        return messages;
    }
}

module.exports = Messaging;