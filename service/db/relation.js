const TypeValidator = require("../../lib").dataUtils.typeValidator;

const tableDetails = Object.freeze({
  name: "user_relation_mapping",
  columns: {
    UID1: {
      name: "uid1",
      type: "number",
    },
    UID2: {
      name: "uid2",
      type: "number",
    },
    RELATION: {
      name: "relation",
      type: "string",
    },
  },
});

class Relation {
  constructor(db) {
    this.db = db;
  }

  addRelation(uid1, uid2, relation) {
    return new Promise((resolve, reject) => {
      try {
        TypeValidator.validate(uid1, tableDetails.columns.UID1.type);
        TypeValidator.validate(uid2, tableDetails.columns.UID2.type);
        TypeValidator.validate(relation, tableDetails.columns.RELATION.type);
      } catch (err) {
        return reject(err);
      }

      if (!this.db.isConnected) {
        return reject(new Error(`Database is not connected`));
      }

      this.db.connection.query(
        `INSERT INTO ${tableDetails.name} (${tableDetails.columns.UID1.name}, ${tableDetails.columns.UID2.name}, ${tableDetails.columns.RELATION.name}) VALUES (${uid1}, ${uid2}, '${relation}')`,
        (err) => {
          if (err) {
            return reject(err);
          }

          return resolve();
        }
      );
    });
  }

  getRelations(uid, relationType = "*") {
    return new Promise((resolve, reject) => {
      try {
        TypeValidator.validate(uid, tableDetails.columns.UID1.type);
        TypeValidator.validate(
          relationType,
          tableDetails.columns.RELATION.type
        );
      } catch (err) {
        return reject(err);
      }

      if (!this.db.isConnected) {
        return reject(new Error(`Database is not connected`));
      }

      let query = `SELECT * FROM ${tableDetails.name} WHERE (${tableDetails.columns.UID1.name}=${uid} OR ${tableDetails.columns.UID2.name}=${uid})`;

      if (relationType !== "*") {
        query += ` AND ${tableDetails.columns.RELATION.name}='${relationType}'`;
      }

      this.db.connection.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }

        return resolve(results);
      });
    });
  }
}

module.exports = Relation;
