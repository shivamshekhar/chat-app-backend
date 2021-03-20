"use strict";

const env = (process.env.NODE_ENV || "development").toLowerCase();

class ErrorController {
  static error(err, req, res, next) {
    let stack;

    if (env !== "production") {
      stack = (err && err.stack) || [];

      if (!Array.isArray(stack) && typeof stack === "string") {
        stack = stack.split("\n");
      }
    }

    return res.status((err && err.status) || 500).json({
      error: (err && err.message) || err,
      stack,
    });
  }
}

module.exports = ErrorController;
