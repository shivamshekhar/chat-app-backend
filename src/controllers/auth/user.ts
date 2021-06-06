import { User as UserService } from "../../service/auth/user";
import { CustomError } from "../../interfaces/common";

export class User {
  static async validateUsernameAndPassword(
    req: any,
    res: any,
    next: any
  ): Promise<any> {
    try {
      const userName = req && req.body && req.body.name;
      const password = req && req.body && req.body.password;

      if (!userName || !password) {
        let err: CustomError = {
          error: new Error("Invalid username / password"),
          status: 400,
        };

        return next(err);
      }

      if (await UserService.checkUserExists(userName)) {
        let err: CustomError = {
          error: new Error(`User already exists`),
          status: 400,
        };

        return next(err);
      }

      return next();
    } catch (err) {
      return next(err);
    }
  }

  static async create(req: any, res: any, next: any): Promise<any> {
    try {
      const userName = req && req.body && req.body.name;
      const password = req && req.body && req.body.password;
      const decryptedUserName = await UserService.create(userName, password);

      return res.status(200).json({
        message: `Successfully created user : ${decryptedUserName}`,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async login(req: any, res: any, next: any): Promise<any> {
    try {
      const userName = req && req.body && req.body.name;
      const password = req && req.body && req.body.password;

      if (!userName || !password) {
        let err: CustomError = {
          error: new Error("Invalid username / password"),
          status: 400,
        };

        return next(err);
      }

      if (!(await UserService.checkUserExists(userName))) {
        let err: CustomError = {
          error: new Error(`User does not exist`),
          status: 400,
        };

        return next(err);
      }

      if (await UserService.isPasswordValid(userName, password)) {
        if (UserService.isUserLoggedIn(userName)) {
          return res.status(200).json({
            message: "User is already logged in.",
            sessionToken: UserService.generateSessionToken(userName),
          });
        } else {
          return res.status(200).json({
            message: `Successfully logged in`,
            sessionToken: UserService.generateSessionToken(userName),
          });
        }
      } else {
        let err: CustomError = {
          error: new Error(`Incorrect username / password for login`),
          status: 403,
        };

        return next(err);
      }
    } catch (err) {
      return next(err);
    }
  }

  static async checkUserExists(req, res, next) {
    try {
      const userName = req && req.params && req.params.user_name;

      if (await UserService.checkUserExists(userName)) {
        return res.status(201).end();
      } else {
        let err: CustomError = {
          error: new Error("User does not exist"),
          status: 400,
        };

        return next(err);
      }
    } catch (err) {
      return next(err);
    }
  }
}
