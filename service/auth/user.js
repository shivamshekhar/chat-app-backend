"use strict";

const uuid = require('uuid');
const crypto = require('crypto');
const { userFriendsMap, userNamePasswordMap, userNameTokenMap, userSessionMap, userTokenNameMap } = require('../../config').user;

class User {
  static create(userName, password) {
    userNameTokenMap[userName] = uuid.v4();

    userTokenNameMap[userNameTokenMap[userName]] = userName;

    const hash = crypto.createHash("sha256");

    hash.update(password);

    userNamePasswordMap[userName] = hash.digest("hex");

    return userNameTokenMap[userName];
  }

  static isPasswordValid(userName, password) {
    const hash = crypto.createHash("sha256");

    hash.update(password);

    const passHash = hash.digest("hex");

    return (passHash === userNamePasswordMap[userName]);
  }

  static isUserLoggedIn(userName, userToken) {
    if(!userToken) {
      userToken = userNameTokenMap[userName];
    }
    
    return (userSessionMap[userToken] !== null && userSessionMap[userToken] !== undefined);
  }

  static generateSessionToken(userName) {
    const sessionToken = uuid.v4();
    const userToken = userNameTokenMap[userName];
    userSessionMap[userToken] = sessionToken;
    return sessionToken;
  }

  static isValidSession(userName, sessionToken) {
    const userToken = userNameTokenMap[userName];
    return (sessionToken === userSessionMap[userToken]);
  }

  static clearSessionToken(userName) {
    const userToken = userNameTokenMap[userName];
    userSessionMap[userToken] = undefined;
  }

  static checkUserExists(userName, userToken) {
    if(!userName) {
      userName = userTokenNameMap[userToken];
    }

    return (userNameTokenMap[userName] !== null && userNameTokenMap[userName] !== undefined)
  }
}

module.exports = User;
