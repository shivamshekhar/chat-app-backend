import {
  userMessagingQueueMap,
  userMessagingEmitterMap,
} from "../../config/message";
import { CryptUtils } from "../../lib/cryptUtils";
import EventEmitter from "events";

export class Messaging {
  static send(message: string, friendName: string, userName: string): void {
    const decryptedFriendName = CryptUtils.decryptString(friendName);
    userMessagingQueueMap[decryptedFriendName] =
      userMessagingQueueMap[decryptedFriendName] || [];
    userMessagingQueueMap[decryptedFriendName].push({
      message,
      sentFrom: userName,
    });

    userMessagingEmitterMap[decryptedFriendName] =
      userMessagingEmitterMap[decryptedFriendName] || new EventEmitter();
    userMessagingEmitterMap[decryptedFriendName].emit("recieved");
  }

  static fetchPolledMessages(decryptedUserName: string): string[] {
    let messages = [];

    userMessagingQueueMap[decryptedUserName] =
      userMessagingQueueMap[decryptedUserName] || [];

    while (userMessagingQueueMap[decryptedUserName].length) {
      let m = userMessagingQueueMap[decryptedUserName].shift();
      messages.push(m);
    }

    return messages;
  }

  static poll(userName: string): Promise<any[]> {
    return new Promise((resolve) => {
      const decryptedUserName = CryptUtils.decryptString(userName);
      userMessagingQueueMap[decryptedUserName] =
        userMessagingQueueMap[decryptedUserName] || [];
      userMessagingEmitterMap[decryptedUserName] =
        userMessagingEmitterMap[decryptedUserName] || new EventEmitter();

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

  static clearListeners(userName: string): void {
    const decryptedUserName = CryptUtils.decryptString(userName);
    userMessagingEmitterMap[decryptedUserName].removeAllListeners("recieved");
  }
}
