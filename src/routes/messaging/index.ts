import express from "express";
import { ErrorController } from "../../controllers/error";
import { Messaging as MessagingController } from "../../controllers/messaging";

export function messagingRoutes(app: express.Express): void {
  app.post("/messaging/send", MessagingController.send, ErrorController.error);

  app.get("/messaging/:user_name/poll", MessagingController.poll, ErrorController.error);
};
