"use strict";

const errorController = require('../../controllers').error;
const userController = require('../../controllers').auth.user;
const messagingController = require('../../controllers').messaging;

module.exports = function (app) {
  app.post("/messaging/send", messagingController.send, errorController.error);

  app.get("/messaging/:user_token/poll", messagingController.poll, errorController.error);
};
