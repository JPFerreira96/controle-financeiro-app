import type { FastifyInstance } from "fastify";

import { AnalysisController } from "../controllers/analysis-controller.js";
import { authenticate } from "../middlewares/authenticate.js";

export const registerAnalysisRoutes = (app: FastifyInstance, analysisController: AnalysisController): void => {
  app.get("/api/analysis/financial-health", { preHandler: authenticate }, analysisController.financialHealth);
};

