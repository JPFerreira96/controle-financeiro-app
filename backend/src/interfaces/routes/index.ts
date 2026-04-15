import type { FastifyInstance } from "fastify";

import type { AppContainer } from "../../config/container.js";
import { registerAnalysisRoutes } from "./analysis-routes.js";
import { registerAuthRoutes } from "./auth-routes.js";
import { registerExpenseRoutes } from "./expense-routes.js";
import { registerIncomeRoutes } from "./income-routes.js";
import { registerReportRoutes } from "./report-routes.js";

export const registerRoutes = (app: FastifyInstance, container: AppContainer): void => {
  registerAuthRoutes(app, container.authController);
  registerIncomeRoutes(app, container.incomeController);
  registerExpenseRoutes(app, container.expenseController);
  registerReportRoutes(app, container.reportController);
  registerAnalysisRoutes(app, container.analysisController);
};

