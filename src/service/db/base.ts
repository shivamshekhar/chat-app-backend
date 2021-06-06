import mysql from "mysql";
import { logger } from "../../lib/logger";

export class Base {
  public connection: mysql.Connection;
  public isConnected: boolean;

  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  _handleDisconnect(): void {
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

  _connectToDb(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        return resolve(undefined);
      }

      this.connection = mysql.createConnection({
        host: "localhost",
        user: "chatAdmin",
        password: "password",
        database: "chat_app",
      });

      this.connection.connect((err) => {
        if (err) {
          logger.error(`Error occurred while connecting to database`, err);
          return reject(err);
        }

        this.isConnected = true;
        logger.log(`Database is successfully connected`);
        return resolve(undefined);
      });
    });
  }

  async init(): Promise<void> {
    await this._connectToDb();
    this._handleDisconnect();
  }
}
