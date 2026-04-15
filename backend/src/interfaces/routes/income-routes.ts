import type { FastifyInstance } from "fastify";

import { IncomeController } from "../controllers/income-controller.js";
import { authenticate } from "../middlewares/authenticate.js";

export const registerIncomeRoutes = (app: FastifyInstance, incomeController: IncomeController): void => {
  app.post("/api/incomes", { preHandler: authenticate }, incomeController.create);
  app.get("/api/incomes", { preHandler: authenticate }, incomeController.list);
  app.put("/api/incomes/:id", { preHandler: authenticate }, incomeController.update);
  app.delete("/api/incomes/:id", { preHandler: authenticate }, incomeController.delete);
};

