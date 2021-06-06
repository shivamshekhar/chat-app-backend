import { v4 } from "uuid";
import { CryptUtils } from "../../lib/cryptUtils";
import { userSessionMap } from "../../config/user";
import { userMessagingEmitterMap } from "../../config/message";
import { db } from "../db";
import EventEmitter from "events";
const userDbService = db.user;

export class User {
  static async create(userName: string, password: string): Promise<string> {
    const decryptedUserName = CryptUtils.decryptString(userName);
    await userDbService.insertNameAndPassword(decryptedUserName, password);
    userMessagingEmitterMap[decryptedUserName] = new EventEmitter();
    return decryptedUserName;
  }

  static async isPasswordValid(userName: string, password: string): Promise<boolean> {
    const decryptedUserName = CryptUtils.decryptString(userName);
    const userData = await userDbService.fetchUserDetailsByName(decryptedUserName);
    return (userData && password && password === userData.password);
  }

  static isUserLoggedIn(userName: string): boolean {
    const decryptedUserName = CryptUtils.decryptString(userName);
    return (
      userSessionMap[decryptedUserName] !== null &&
      userSessionMap[decryptedUserName] !== undefined
    );
  }

  static generateSessionToken(userName: string): string {
    const decryptedUserName = CryptUtils.decryptString(userName);
    const sessionToken = v4();
    userSessionMap[decryptedUserName] = sessionToken;
    return sessionToken;
  }

  static isValidSession(userName: string, sessionToken: string): boolean {
    const decryptedUserName = CryptUtils.decryptString(userName);
    return sessionToken === userSessionMap[decryptedUserName];
  }

  static clearSessionToken(userName: string): void {
    const decryptedUserName = CryptUtils.decryptString(userName);
    userSessionMap[decryptedUserName] = undefined;
  }

  static async checkUserExists(userName: string): Promise<boolean> {
    const decryptedUserName = CryptUtils.decryptString(userName);
    const userData = await userDbService.fetchUserDetailsByName(
      decryptedUserName
    );

    if (userData) {
      return true;
    } else {
      return false;
    }
  }
}
