"use strict";

const errorController = require('../../controllers').error;
const relationController = require('../../controllers').relation;

module.exports = function (app) {
  app.get("/user/:user_name/relation/:relation_type", relationController.fetchRelations, errorController.error);
};
