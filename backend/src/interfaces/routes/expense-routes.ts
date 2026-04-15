import type { FastifyInstance } from "fastify";

import { ExpenseController } from "../controllers/expense-controller.js";
import { authenticate } from "../middlewares/authenticate.js";

export const registerExpenseRoutes = (app: FastifyInstance, expenseController: ExpenseController): void => {
  app.post("/api/expenses", { preHandler: authenticate }, expenseController.create);
  app.get("/api/expenses", { preHandler: authenticate }, expenseController.list);
};

