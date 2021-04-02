const mysql = require("mysql");
const User = require('./user');
const logger = require('../../lib').logger;

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

  init() {
    return new Promise((resolve, reject) => {
        if(process.env.NO_DB) {
            logger.log(`Skipping connecting to database, as app is running in NO DB mode`);
            return resolve();
        }

        this.connection.connect(err => {
            if(err) {
                logger.error(`Error occurred while connecting to database`, err);
                return reject(err);
            }

            this.isConnected = true;
            logger.log(`Database is successfully connected`);
            return resolve();
        });
    });
  }
}

const dbObj = new Db();
const userObj = new User(dbObj);

module.exports = {
    init : dbObj.init.bind(dbObj),
    user : userObj
};
