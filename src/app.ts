import express from "express";
import cors from "cors";
import { routes } from "./routes";
import { logger } from "./lib/logger";
import { db } from "./service/db";

const corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
};

async function main(): Promise<void> {
  try {
    await db.init();
    const app = express();
    const port = process.env.PORT || 4000;
    app.use(express.json());
    app.use(cors(corsOptions));
    routes(app);
    app.listen(port, () => {
      logger.log(`Chat app listening at ${port}`);
    });
  } catch (err) {
    logger.log(`Error occurred while starting app. Error :`, err);
    process.exit(1);
  }
}

main();
