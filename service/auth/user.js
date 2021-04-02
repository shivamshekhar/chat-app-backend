"use strict";

const uuid = require("uuid");
const cryptUtils = require("../../lib").cryptUtils;
const { userSessionMap } = require("../../config").user;
const { userMessagingEmitterMap } = require("../../config").message;
const userDbService = require("../db").user;
const EventEmitter = require("events");

class User {
  static async create(userName, password) {
    const decryptedUserName = cryptUtils.decryptUserName(userName);
    await userDbService.insertNameAndPassword(decryptedUserName, password);
    userMessagingEmitterMap[decryptedUserName] = new EventEmitter();
    return decryptedUserName;
  }

  static async isPasswordValid(userName, password) {
    const decryptedUserName = cryptUtils.decryptUserName(userName);
    const userData = await userDbService.fetchUserDetailsByName(decryptedUserName);
    return (userData && password && password === userData.password);
  }

  static isUserLoggedIn(userName) {
    const decryptedUserName = cryptUtils.decryptUserName(userName);
    return (
      userSessionMap[decryptedUserName] !== null &&
      userSessionMap[decryptedUserName] !== undefined
    );
  }

  static generateSessionToken(userName) {
    const decryptedUserName = cryptUtils.decryptUserName(userName);
    const sessionToken = uuid.v4();
    userSessionMap[decryptedUserName] = sessionToken;
    return sessionToken;
  }

  static isValidSession(userName, sessionToken) {
    const decryptedUserName = cryptUtils.decryptUserName(userName);
    return sessionToken === userSessionMap[decryptedUserName];
  }

  static clearSessionToken(userName) {
    const decryptedUserName = cryptUtils.decryptUserName(userName);
    userSessionMap[decryptedUserName] = undefined;
  }

  static async checkUserExists(userName) {
    const decryptedUserName = cryptUtils.decryptUserName(userName);
    const userData = await userDbService.fetchUserDetailsByName(
      decryptedUserName
    );

    if (userData) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = User;
