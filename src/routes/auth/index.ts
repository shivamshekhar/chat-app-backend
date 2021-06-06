import express from "express";
import { ErrorController } from "../../controllers/error";
import { User as UserController } from "../../controllers/auth/user";

export function authRoutes(app: express.Express): void {
  app.post("/auth/user/create", UserController.validateUsernameAndPassword, UserController.create, ErrorController.error);

  app.post("/auth/user/login", UserController.login, ErrorController.error);

  app.get("/auth/user/:user_name/exists", UserController.checkUserExists, ErrorController.error);
};
