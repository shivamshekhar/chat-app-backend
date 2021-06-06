import { Base } from './base';

const tableDetails = Object.freeze({
  name: "user_details",
  columns: {
    ID: {
      name: "name",
      type: "number",
    },
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

export class User {
  private db: Base;

  constructor(db: Base) {
    this.db = db;
  }

  insertNameAndPassword(name: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db.isConnected) {
        return reject(new Error(`Database is not connected`));
      }

      this.db.connection.query(
        `INSERT INTO ${tableDetails.name} (${tableDetails.columns.NAME.name}, ${tableDetails.columns.PASSWORD.name}) VALUES ('${name}','${password}')`,
        (err) => {
          if (err) {
            return reject(err);
          }

          return resolve(undefined);
        }
      );
    });
  }

  fetchUserDetailsByName(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db.isConnected) {
        return reject(new Error(`Database is not connected`));
      }

      this.db.connection.query(
        `SELECT * FROM user_details WHERE name='${name}'`,
        (err, results) => {
          if (err) {
            return reject(err);
          }

          return resolve(results && results[0]);
        }
      );
    });
  }

  fetchManyUserDetailsById(id: number | number[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(id)) {
        id = [id];
      }

      if (!this.db.isConnected) {
        return reject(new Error(`Database is not connected`));
      }

      if(!id.length) {
        return resolve([]);
      }

      this.db.connection.query(
        `SELECT * FROM user_details WHERE id in (${id.join(",")})`,
        (err, results) => {
          if (err) {
            return reject(err);
          }

          return resolve(results);
        }
      );
    });
  }
}
