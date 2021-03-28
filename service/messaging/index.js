const {
  userMessagingQueueMap,
  userMessagingEmitterMap,
} = require("../../config").message;
const cryptUtils = require("../../lib").cryptUtils;
class Messaging {
  static send(message, friendName, userName) {
    const decryptedUserName = cryptUtils.decryptUserName(userName);
    const decryptedFriendName = cryptUtils.decryptUserName(friendName);
    userMessagingQueueMap[decryptedFriendName] =
      userMessagingQueueMap[decryptedFriendName] || [];
    userMessagingQueueMap[decryptedFriendName].push({
      message,
      sentFrom: decryptedUserName,
    });

    userMessagingEmitterMap[decryptedFriendName].emit("recieved");
  }

  static fetchPolledMessages(decryptedUserName) {
    let messages = [];

    userMessagingQueueMap[decryptedUserName] =
      userMessagingQueueMap[decryptedUserName] || [];

    while (userMessagingQueueMap[decryptedUserName].length) {
      let m = userMessagingQueueMap[decryptedUserName].shift();
      messages.push(m);
    }

    return messages;
  }

  static poll(userName) {
    return new Promise((resolve) => {
      const decryptedUserName = cryptUtils.decryptUserName(userName);
      userMessagingQueueMap[decryptedUserName] =
        userMessagingQueueMap[decryptedUserName] || [];

      if (userMessagingQueueMap[decryptedUserName].length) {
        return resolve(this.fetchPolledMessages(decryptedUserName));
      } else {
        const timeoutRef = setTimeout(() => {
          userMessagingEmitterMap[decryptedUserName].removeAllListeners(
            "recieved"
          );
          return resolve([]);
        }, 60000);

        userMessagingEmitterMap[decryptedUserName].once("recieved", () => {
          clearTimeout(timeoutRef);
          return resolve(this.fetchPolledMessages(decryptedUserName));
        });
      }
    });
  }

  static clearListeners(userName) {
    const decryptedUserName = cryptUtils.decryptUserName(userName);
    userMessagingEmitterMap[decryptedUserName].removeAllListeners("recieved");
  }
}

module.exports = Messaging;
