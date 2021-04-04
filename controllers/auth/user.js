"use strict";

const UserService = require("../../service").auth.user;

class User {
  static async validateUsernameAndPassword(req, res, next) {
    try {
      const userName = req && req.body && req.body.name;
      const password = req && req.body && req.body.password;

      if (!userName || !password) {
        let err = new Error("Invalid username / password");
        err.status = 400;
        return next(err);
      }

      if (await UserService.checkUserExists(userName)) {
        let err = new Error(`User already exists`);
        err.status = 400;
        return next(err);
      }

      return next();
    } catch (err) {
      return next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const userName = req && req.body && req.body.name;
      const password = req && req.body && req.body.password;
      const decryptedUserName = await UserService.create(userName, password);

      return res.status(200).json({
        message: `Successfully created user : ${decryptedUserName}`,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const userName = req && req.body && req.body.name;
      const password = req && req.body && req.body.password;

      if (!userName || !password) {
        let err = new Error("Invalid username / password");
        err.status = 400;
        return next(err);
      }

      if (!(await UserService.checkUserExists(userName))) {
        let err = new Error(`User does not exist`);
        err.status = 400;
        return next(err);
      }

      if (await UserService.isPasswordValid(userName, password)) {
        if (UserService.isUserLoggedIn(userName)) {
          return res.status(200).json({
            message: "User is already logged in.",
            sessionToken: UserService.generateSessionToken(userName),
          });
        } else {
          return res.status(200).json({
            message: `Successfully logged in`,
            sessionToken: UserService.generateSessionToken(userName),
          });
        }
      } else {
        let err = new Error(`Incorrect username / password for login`);
        err.status = 403;
        return next(err);
      }
    } catch (err) {
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

  static async checkUserExists(req, res, next) {
    try {
      const userName = req && req.params && req.params.user_name;

      if (await UserService.checkUserExists(userName)) {
        return res.status(201).end();
      } else {
        let err = new Error("User does not exist");
        err.status = 400;
        return next(err);
      }
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = User;
