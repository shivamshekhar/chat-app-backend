import { Base } from "./base";

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

export class Relation {
  private db: Base;

  constructor(db: Base) {
    this.db = db;
  }

  addRelation(uid1: string, uid2: string, relation: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db.isConnected) {
        return reject(new Error(`Database is not connected`));
      }

      this.db.connection.query(
        `INSERT INTO ${tableDetails.name} (${tableDetails.columns.UID1.name}, ${tableDetails.columns.UID2.name}, ${tableDetails.columns.RELATION.name}) VALUES (${uid1}, ${uid2}, '${relation}')`,
        (err) => {
          if (err) {
            return reject(err);
          }

          return resolve(undefined);
        }
      );
    });
  }

  getRelations(uid: string, relationType: string = "*"): Promise<any[]> {
    return new Promise((resolve, reject) => {
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
