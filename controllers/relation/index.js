"use strict";

const UserService = require("../../service").auth.user;
const MessagingService = require("../../service").messaging;
const RelationService = require("../../service").relation;
const logger = require("../../lib").logger;

class Relation {
  static async fetchRelations(req, res, next) {
    try {
      const userName = req && req.params && req.params.user_name;
      const userSessionToken =
        req && req.headers && req.headers["session-token"];
      const relationType = req && req.params && req.params.relation_type;

      for (let val of [userName, relationType, userSessionToken]) {
        if (!val) {
          let err = new Error("Mandatory params missing");
          err.status = 400;
          return next(err);
        }
      }

      if (!(await UserService.checkUserExists(userName))) {
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
        const relations = await RelationService.fetchRelations(userName, relationType);
        return res.status(200).json(relations);
      }
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = Relation;
