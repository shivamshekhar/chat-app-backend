"use strict";

const authRoutes = require('./auth');
const messagingRoutes = require('./messaging');

module.exports = function(app) {
    app.get('/test', (req, res) => {
        return res.status(200).json({
            message : "App is running successfully"
        });
    });
    authRoutes(app);
    messagingRoutes(app);
};