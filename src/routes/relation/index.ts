import express from "express";
import { ErrorController } from "../../controllers/error";
import { Relation as RelationController } from "../../controllers/relation";

export function relationRoutes(app: express.Express): void {
  app.get("/user/:user_name/relation/:relation_type", RelationController.fetchRelations, ErrorController.error);
};
