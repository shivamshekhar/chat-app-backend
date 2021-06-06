import express from "express";
import { authRoutes } from "./auth";
import { messagingRoutes } from "./messaging";
import { relationRoutes } from "./relation";

export function routes(app: express.Express): void {
  authRoutes(app);
  messagingRoutes(app);
  relationRoutes(app);

  app.get("/test", (req, res) => {
    return res.status(200).json({
      message: "App is running successfully",
    });
  });

  app.all("*", (req, res) => {
    return res.status(404).json({
      message: "Not found",
    });
  });
};
