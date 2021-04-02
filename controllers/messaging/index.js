"use strict";

const UserService = require("../../service").auth.user;
const MessagingService = require("../../service").messaging;
const logger = require("../../lib").logger;

class Messaging {
  static async send(req, res, next) {
    try {
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

      if (
        !(await UserService.checkUserExists(userName)) ||
        !(await UserService.checkUserExists(friendName))
      ) {
        let err = new Error("No such user exists");
        err.status = 400;
        return next(err);
      }

      if (
        !UserService.isUserLoggedIn(userName) ||
        !UserService.isValidSession(userName, userSessionToken)
      ) {
        let err = new Error("User login required");
        err.status = 401;
        return next(err);
      } else {
        MessagingService.send(message, friendName, userName);
        return res.status(201).end();
      }
    } catch (err) {
      return next(err);
    }
  }

  static async poll(req, res, next) {
    try {
      const userName = req && req.params && req.params.user_name;
      const sessionToken = req && req.headers && req.headers["session-token"];

      if (!(await UserService.checkUserExists(userName))) {
        let err = new Error("No such user exists");
        err.status = 400;
        return next(err);
      }

      if (
        !UserService.isUserLoggedIn(userName) ||
        !UserService.isValidSession(userName, sessionToken)
      ) {
        let err = new Error("User login required");
        err.status = 401;
        return next(err);
      } else {
        req.once("close", () => {
          logger.log(
            "Connection closed by client. Clearing all messaging listeners"
          );
          MessagingService.clearListeners(userName);
        });

        const messages = await MessagingService.poll(userName);
        return res.status(200).json(messages);
      }
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = Messaging;
