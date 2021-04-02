"use strict";

const authRoutes = require("./auth");
const messagingRoutes = require("./messaging");

module.exports = function (app) {
  authRoutes(app);
  messagingRoutes(app);

  app.get("/test", (req, res) => {
    return res.status(200).json({
      message: "App is running successfully",
    });
  });

  app.all("*", (req, res) => {
    return res.status(404).json({
      message: "Not found",
    });
  });
};
