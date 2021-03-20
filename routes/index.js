"use strict";

const authRoutes = require('./auth');
const messagingRoutes = require('./messaging');

module.exports = function(app) {
    authRoutes(app);
    messagingRoutes(app);
};