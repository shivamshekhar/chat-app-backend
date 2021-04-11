const mysql = require("mysql");
const User = require("./user");
const Relation = require("./relation");
const logger = require("../../lib").logger;

class Db {
  constructor() {
    this.connection = mysql.createConnection({
      host: "localhost",
      user: "chatAdmin",
      password: "password",
      database: "chat_app",
    });

    this.isConnected = false;
  }

  _handleDisconnect() {
    this.connection.on("error", (err) => {
      logger.log("db error", err);
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        this.isConnected = false;
        setTimeout(this._connectToDb, 60000);
      } else {
        throw err;
      }
    });
  }

  _connectToDb() {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        return resolve();
      }

      this.connection.connect((err) => {
        if (err) {
          logger.error(`Error occurred while connecting to database`, err);
          return reject(err);
        }

        this.isConnected = true;
        logger.log(`Database is successfully connected`);
        return resolve();
      });
    });
  }

  async init() {
    await this._connectToDb();
    this._handleDisconnect();
  }
}

const dbObj = new Db();
const userObj = new User(dbObj);
const relationObj = new Relation(dbObj);

module.exports = {
  init: dbObj.init.bind(dbObj),
  user: userObj,
  relation: relationObj,
};

// (async function() {
//     const db = require('../db');
//     await db.init();
//     const response = await db.relation.getRelations(7, 'blocked');
//     console.log(response);
//     process.exit(0);
// }())
