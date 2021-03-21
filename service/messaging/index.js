const { userMessagingQueueMap } = require("../../config").message;
const cryptUtils = require('../../lib').cryptUtils;

class Messaging {
    static send(message, friendName, userName) {
        const decryptedUserName = cryptUtils.decryptUserName(userName);
        const decryptedFriendName = cryptUtils.decryptUserName(friendName);
        userMessagingQueueMap[decryptedFriendName] = userMessagingQueueMap[decryptedFriendName] || [];
        userMessagingQueueMap[decryptedFriendName].push({
            message,
            sentFrom : decryptedUserName
        });
    }

    static poll(userName) {
        const decryptedUserName = cryptUtils.decryptUserName(userName);
        userMessagingQueueMap[decryptedUserName] = userMessagingQueueMap[decryptedUserName] || [];
        
        let messages = [];

        while(userMessagingQueueMap[decryptedUserName].length) {
            let m = userMessagingQueueMap[decryptedUserName].shift();
            messages.push(m);
        }

        return messages;
    }
}

module.exports = Messaging;