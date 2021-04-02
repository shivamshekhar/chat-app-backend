const TypeValidator = require("../../lib").dataUtils.typeValidator;
const { userMap } = require("../../config").user;

const tableDetails = Object.freeze({
  name: "user_details",
  columns: {
    NAME: {
      name: "name",
      type: "string",
    },
    PASSWORD: {
      name: "password",
      type: "string",
    },
  },
});

class User {
  constructor(db) {
    this.db = db;
  }

  insertNameAndPassword(name, password) {
    return new Promise((resolve, reject) => {
      try {
        TypeValidator.validate(
          name,
          tableDetails.columns.NAME.type
        );
        TypeValidator.validate(
          password,
          tableDetails.columns.PASSWORD.type
        );
      } catch (err) {
        return reject(err);
      }

      if (process.env.NO_DB) {
        userMap[name] = {
          name,
          password
        };

        return resolve();
      }

      if (!this.db.isConnected) {
        return reject(new Error(`Database is not connected`));
      }

      this.db.connection.query(
        `INSERT INTO user_details (${tableDetails.columns.NAME.name}, ${tableDetails.columns.PASSWORD.name}) VALUES ('${name}','${password}')`,
        (err) => {
          if (err) {
            return reject(err);
          }

          return resolve();
        }
      );
    });
  }

  fetchUserDetailsByName(name) {
    return new Promise((resolve, reject) => {
      try {
        TypeValidator.validate(name, tableDetails.columns.NAME.type);
      } catch (err) {
        return reject(err);
      }

      if (process.env.NO_DB) {
        return resolve(userMap[name]);
      }

      if (!this.db.isConnected) {
        return reject(new Error(`Database is not connected`));
      }

      this.db.connection.query(
        `SELECT * FROM user_details WHERE name='${name}'`,
        (err, results) => {
          if (err) {
            return reject(err);
          }

          return resolve((results && results[0]));
        }
      );
    });
  }
}

module.exports = User;
