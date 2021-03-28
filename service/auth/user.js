"use strict";

const uuid = require('uuid');
const crypto = require('crypto');
const cryptUtils = require('../../lib').cryptUtils;
const { userSessionMap, userMap } = require('../../config').user;
const { userMessagingEmitterMap } = require('../../config').message;
const EventEmitter = require('events');

class User {
  static create(userName, password) {
    const decryptedUserName = cryptUtils.decryptUserName(userName);
    userMap[decryptedUserName] = {
      name : decryptedUserName,
      password : password
    };
    userMessagingEmitterMap[decryptedUserName] = new EventEmitter();
    return decryptedUserName;
  }

  static isPasswordValid(userName, password) {
    const decryptedUserName = cryptUtils.decryptUserName(userName);
    const userDetails = userMap[decryptedUserName] || {};
    return (password === userDetails.password);
  }

  static isUserLoggedIn(userName) {
    const decryptedUserName = cryptUtils.decryptUserName(userName);
    return (userSessionMap[decryptedUserName] !== null && userSessionMap[decryptedUserName] !== undefined);
  }

  static generateSessionToken(userName) {
    const decryptedUserName = cryptUtils.decryptUserName(userName);
    const sessionToken = uuid.v4();
    userSessionMap[decryptedUserName] = sessionToken;
    return sessionToken;
  }

  static isValidSession(userName, sessionToken) {
    const decryptedUserName = cryptUtils.decryptUserName(userName);
    return (sessionToken === userSessionMap[decryptedUserName]);
  }

  static clearSessionToken(userName) {
    const decryptedUserName = cryptUtils.decryptUserName(userName);
    userSessionMap[decryptedUserName] = undefined;
  }

  static checkUserExists(userName) {
    const decryptedUserName = cryptUtils.decryptUserName(userName);
    return (userMap[decryptedUserName] !== null && userMap[decryptedUserName] !== undefined);
  }
}

module.exports = User;
