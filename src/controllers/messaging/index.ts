import { User as UserService } from "../../service/auth/user";
import { Messaging as MessagingService } from "../../service/messaging";
import { logger } from "../../lib/logger";
import { CustomError } from "../../interfaces/common";

export class Messaging {
  static async send(req: any, res: any, next: any): Promise<any> {
    try {
      const userName = req && req.body && req.body.userName;
      const userSessionToken = req && req.body && req.body.sessionToken;
      const message = req && req.body && req.body.message;
      const friendName = req && req.body && req.body.friendName;

      for (let val of [userName, message, friendName, userSessionToken]) {
        if (!val) {
          let err: CustomError = {
            error: new Error("Mandatory params missing"),
            status: 400,
          };
          return next(err);
        }
      }

      if (
        !(await UserService.checkUserExists(userName)) ||
        !(await UserService.checkUserExists(friendName))
      ) {
        let err: CustomError = {
          error: new Error("No such user exists"),
          status: 400,
        };
        return next(err);
      }

      if (
        !UserService.isUserLoggedIn(userName) ||
        !UserService.isValidSession(userName, userSessionToken)
      ) {
        let err: CustomError = {
          error: new Error("User login required"),
          status: 401,
        };
        return next(err);
      } else {
        MessagingService.send(message, friendName, userName);
        return res.status(201).end();
      }
    } catch (err) {
      return next(err);
    }
  }

  static async poll(req: any, res: any, next: any): Promise<any> {
    try {
      const userName = req && req.params && req.params.user_name;
      const sessionToken = req && req.headers && req.headers["session-token"];

      if (!(await UserService.checkUserExists(userName))) {
        let err: CustomError = {
          error: new Error("No such user exists"),
          status: 400,
        };
        return next(err);
      }

      if (
        !UserService.isUserLoggedIn(userName) ||
        !UserService.isValidSession(userName, sessionToken)
      ) {
        let err: CustomError = {
          error: new Error("User login required"),
          status: 401,
        };
        return next(err);
      } else {
        req.once("close", () => {
          logger.log(
            "Connection closed by client. Clearing all messaging listeners"
          );
          MessagingService.clearListeners(userName);
        });

        const messages = await MessagingService.poll(userName);
        return res.status(200).json(messages);
      }
    } catch (err) {
      return next(err);
    }
  }
}
