import { User as UserService } from "../../service/auth/user";
import { Relation as RelationService } from "../../service/relation";
import { CustomError } from "../../interfaces/common";

export class Relation {
  static async fetchRelations(req: any, res: any, next: any): Promise<any> {
    try {
      const userName = req && req.params && req.params.user_name;
      const userSessionToken =
        req && req.headers && req.headers["session-token"];
      const relationType = req && req.params && req.params.relation_type;

      for (let val of [userName, relationType, userSessionToken]) {
        if (!val) {
          let err: CustomError = {
            error: new Error("Mandatory params missing"),
            status: 400,
          };
          return next(err);
        }
      }

      if (!(await UserService.checkUserExists(userName))) {
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
        const relations = await RelationService.fetchRelations(
          userName,
          relationType
        );
        return res.status(200).json(relations);
      }
    } catch (err) {
      return next(err);
    }
  }
}
