"use strict";

const UserService = require("../../service").auth.user;
const MessagingService = require('../../service').messaging;

class Messaging {
  static send(req, res, next) {
    const userToken = req && req.body && req.body.userToken;
    const message = req && req.body && req.body.message;
    const friendToken = req && req.body && req.body.friendToken;

    for (let val of [userToken, message, friendToken]) {
      if (!val) {
        let err = new Error("Mandatory params missing");
        err.status = 400;
        return next(err);
      }
    }

    if(!UserService.checkUserExists(null, friendToken) || !UserService.checkUserExists(null, userToken)) {
        let err = new Error("No such user exists");
        err.status = 400;
        return next(err);
    }

    if (!UserService.isUserLoggedIn(null, userToken)) {
        let err = new Error("User login required");
        err.status = 401;
        return next(err);
    } else {
        MessagingService.send(message, friendToken, userToken);
        return res.status(201).end();
    }
  }

  static poll(req, res, next) {
    const userToken = req && req.params && req.params.user_token;

    if(!UserService.checkUserExists(null, userToken)) {
        let err = new Error("No such user exists");
        err.status = 400;
        return next(err);
    }

    if (!UserService.isUserLoggedIn(null, userToken)) {
        let err = new Error("User login required");
        err.status = 401;
        return next(err);
    } else {
        const messages = MessagingService.poll(userToken);
        return res.status(200).json(messages);
    }
  }
}

module.exports = Messaging;
