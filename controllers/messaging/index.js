"use strict";

const UserService = require("../../service").auth.user;
const MessagingService = require('../../service').messaging;

class Messaging {
  static send(req, res, next) {
    const userName = req && req.body && req.body.userName;
    const userSessionToken = req && req.body && req.body.sessionToken;
    const message = req && req.body && req.body.message;
    const friendName = req && req.body && req.body.friendName;

    for (let val of [userName, message, friendName, userSessionToken]) {
      if (!val) {
        let err = new Error("Mandatory params missing");
        err.status = 400;
        return next(err);
      }
    }

    if(!UserService.checkUserExists(userName) || !UserService.checkUserExists(friendName)) {
        let err = new Error("No such user exists");
        err.status = 400;
        return next(err);
    }

    if (!UserService.isUserLoggedIn(userName) || !UserService.isValidSession(userName, userSessionToken)) {
        let err = new Error("User login required");
        err.status = 401;
        return next(err);
    } else {
        MessagingService.send(message, friendName, userName);
        return res.status(201).end();
    }
  }

  static poll(req, res, next) {
    const userName = req && req.params && req.params.user_name;
    const sessionToken = req && req.headers && req.headers.session_token;

    if(!UserService.checkUserExists(userName)) {
        let err = new Error("No such user exists");
        err.status = 400;
        return next(err);
    }

    if (!UserService.isUserLoggedIn(userName) || !UserService.isValidSession(userName, sessionToken)) {
        let err = new Error("User login required");
        err.status = 401;
        return next(err);
    } else {
        const messages = MessagingService.poll(userName);
        return res.status(200).json(messages);
    }
  }
}

module.exports = Messaging;
