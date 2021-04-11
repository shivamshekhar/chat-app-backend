"use strict";

const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const logger = require("./lib").logger;
const Db = require("./service").db;
const corsOptions = {
  origin: ["http://localhost:3000", "http://15.206.209.215", "https://15.206.209.215"],
  optionsSuccessStatus: 200,
};

async function main() {
  if (require.main == module) {
    try {
      await Db.init();
      const app = express();
      const port = 3000;
      app.use(express.json());
      app.use(cors(corsOptions));
      routes(app);
      app.listen(port, () => {
        logger.log(`Chat app listening at ${port}`);
      });
    } catch (err) {
      logger.log(`Error occurred while starting app. Error :`, err);
      process.exit(1);
    }
  }
}

main();
