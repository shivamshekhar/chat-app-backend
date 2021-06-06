import { CustomError } from "../../interfaces/common";
const env = (process.env.NODE_ENV || "development").toLowerCase();

export class ErrorController {
  static error(err: CustomError, req: any, res: any, next: any): any {
    let stack: any;

    if (env !== "production") {
      stack = err.error.stack;
    }

    return res.status(err.status || 500).json({
      error: err.error.message,
      stack,
    });
  }
}
