"use strict";

const UserService = require("../../service").auth.user;

class User {
  static validateUsernameAndPassword(req, res, next) {
    const userName = req && req.body && req.body.name;
    const password = req && req.body && req.body.password;

    if (!userName || !password) {
      let err = new Error("Invalid username / password");
      err.status = 400;
      return next(err);
    }

    if (UserService.checkUserExists(userName)) {
      let err = new Error(`User name : ${userName} already exists`);
      err.status = 400;
      return next(err);
    }

    return next();
  }

  static create(req, res, next) {
    const userName = req && req.body && req.body.name;
    const password = req && req.body && req.body.password;
    const token = UserService.create(userName, password);

    return res.status(200).json({
      message: `Successfully created user : ${userName}`,
      token,
    });
  }

  static login(req, res, next) {
    const userName = req && req.body && req.body.name;

    if (UserService.isUserLoggedIn(userName)) {
      return res.status(302).json({
        message: "User is already logged in.",
      });
    }

    const password = req && req.body && req.body.password;

    if (!userName || !password) {
      let err = new Error("Invalid username / password");
      err.status = 400;
      return next(err);
    }

    if (!UserService.checkUserExists(userName)) {
      let err = new Error(`User name : ${userName} does not exist`);
      err.status = 400;
      return next(err);
    }

    if (UserService.isPasswordValid(userName, password)) {
      return res.status(200).json({
        message: `Successfully logged in user : ${userName}`,
        sessionToken: UserService.generateSessionToken(userName),
      });
    } else {
      let err = new Error(`Incorrect username / password for login`);
      err.status = 403;
      return next(err);
    }
  }

  static logout(req, res, next) {
    const userName = req && req.body && req.body.name;
    const sessionToken = req && req.body && req.body.sessionToken;

    if (
      !userName ||
      !sessionToken ||
      !UserService.isValidSession(userName, sessionToken)
    ) {
      return res.status(400).json({
        error: "Invalid username / login details",
      });
    }

    UserService.clearSessionToken(userName);

    return res.status(200).json({
      message: "Successfully logged out",
    });
  }
}

module.exports = User;
