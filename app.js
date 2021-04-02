"use strict";

const express = require("express");
const routes = require("./routes");
const Db = require('./service').db;

(async function () {
  if (require.main == module) {
    try {
      await Db.init();
      const app = express();
      const port = 3000;
      app.use(express.json());
      routes(app);
      app.listen(port, () => {
        console.log(`Chat app listening at ${port}`);
      });
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }
})();
