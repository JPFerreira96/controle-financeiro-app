import type { FastifyInstance } from "fastify";

import { ReportController } from "../controllers/report-controller.js";
import { authenticate } from "../middlewares/authenticate.js";

export const registerReportRoutes = (app: FastifyInstance, reportController: ReportController): void => {
  app.get("/api/reports/dashboard", { preHandler: authenticate }, reportController.dashboard);
  app.get("/api/reports/charts", { preHandler: authenticate }, reportController.charts);
  app.get("/api/reports/monthly-summary", { preHandler: authenticate }, reportController.monthlySummary);
  app.get("/api/reports/annual-summary", { preHandler: authenticate }, reportController.annualSummary);
};

