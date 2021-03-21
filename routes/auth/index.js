"use strict";

const errorController = require('../../controllers').error;
const userController = require('../../controllers').auth.user;

module.exports = function (app) {
  app.post("/auth/user/create", userController.validateUsernameAndPassword, userController.create, errorController.error);

  app.post("/auth/user/login", userController.login, errorController.error);

  app.post("/auth/user/logout", userController.logout, errorController.error);

  app.get("/auth/user/:user_name/exists", userController.checkUserExists, errorController.error);
};
