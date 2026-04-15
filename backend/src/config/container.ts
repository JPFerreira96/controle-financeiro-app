import type { FastifyInstance } from "fastify";

import { FinancialReportService } from "../application/services/financial-report-service.js";
import { PasswordService } from "../application/services/password-service.js";
import type { IExpenseRepository } from "../domain/repositories/expense-repository.js";
import type { IIncomeRepository } from "../domain/repositories/income-repository.js";
import type { IUserRepository } from "../domain/repositories/user-repository.js";
import { AnalyzeFinancialHealthUseCase } from "../domain/useCases/analysis/analyze-financial-health-use-case.js";
import { LoginUseCase } from "../domain/useCases/auth/login-use-case.js";
import { RegisterUserUseCase } from "../domain/useCases/auth/register-user-use-case.js";
import { CreateExpenseUseCase } from "../domain/useCases/expenses/create-expense-use-case.js";
import { ListExpensesUseCase } from "../domain/useCases/expenses/list-expenses-use-case.js";
import { UpdateExpenseUseCase } from "../domain/useCases/expenses/update-expense-use-case.js";
import { DeleteExpenseUseCase } from "../domain/useCases/expenses/delete-expense-use-case.js";
import { CreateIncomeUseCase } from "../domain/useCases/incomes/create-income-use-case.js";
import { ListIncomesUseCase } from "../domain/useCases/incomes/list-incomes-use-case.js";
import { UpdateIncomeUseCase } from "../domain/useCases/incomes/update-income-use-case.js";
import { DeleteIncomeUseCase } from "../domain/useCases/incomes/delete-income-use-case.js";
import { GetDashboardReportUseCase } from "../domain/useCases/reports/get-dashboard-report-use-case.js";
import { env } from "./env.js";
import { createAIProvider } from "../infrastructure/aiProviders/ai-provider-factory.js";
import { prisma } from "../infrastructure/database/prisma-client.js";
import { MockExpenseRepository } from "../infrastructure/repositories/mock-expense-repository.js";
import { MockIncomeRepository } from "../infrastructure/repositories/mock-income-repository.js";
import { MockUserRepository } from "../infrastructure/repositories/mock-user-repository.js";
import { PrismaExpenseRepository } from "../infrastructure/repositories/prisma-expense-repository.js";
import { PrismaIncomeRepository } from "../infrastructure/repositories/prisma-income-repository.js";
import { PrismaUserRepository } from "../infrastructure/repositories/prisma-user-repository.js";
import { AnalysisController } from "../interfaces/controllers/analysis-controller.js";
import { AuthController } from "../interfaces/controllers/auth-controller.js";
import { ExpenseController } from "../interfaces/controllers/expense-controller.js";
import { IncomeController } from "../interfaces/controllers/income-controller.js";
import { ReportController } from "../interfaces/controllers/report-controller.js";

export interface AppContainer {
  authController: AuthController;
  incomeController: IncomeController;
  expenseController: ExpenseController;
  reportController: ReportController;
  analysisController: AnalysisController;
}

export const createContainer = (app: FastifyInstance): AppContainer => {
  let userRepository: IUserRepository;
  let incomeRepository: IIncomeRepository;
  let expenseRepository: IExpenseRepository;

  if (env.USE_MOCK_MODE) {
    userRepository = new MockUserRepository();
    incomeRepository = new MockIncomeRepository();
    expenseRepository = new MockExpenseRepository();
  } else {
    userRepository = new PrismaUserRepository(prisma);
    incomeRepository = new PrismaIncomeRepository(prisma);
    expenseRepository = new PrismaExpenseRepository(prisma);
  }

  const passwordService = new PasswordService();
  const financialReportService = new FinancialReportService();
  const { provider: aiProvider, fallbackProvider } = createAIProvider();

  const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordService);
  const loginUseCase = new LoginUseCase(userRepository, passwordService, (payload) => app.jwt.sign(payload));

  const createIncomeUseCase = new CreateIncomeUseCase(incomeRepository);
  const listIncomesUseCase = new ListIncomesUseCase(incomeRepository);
  const updateIncomeUseCase = new UpdateIncomeUseCase(incomeRepository);
  const deleteIncomeUseCase = new DeleteIncomeUseCase(incomeRepository);

  const createExpenseUseCase = new CreateExpenseUseCase(expenseRepository);
  const listExpensesUseCase = new ListExpensesUseCase(expenseRepository);
  const updateExpenseUseCase = new UpdateExpenseUseCase(expenseRepository);
  const deleteExpenseUseCase = new DeleteExpenseUseCase(expenseRepository);

  const getDashboardReportUseCase = new GetDashboardReportUseCase(
    incomeRepository,
    expenseRepository,
    financialReportService,
  );
  const analyzeFinancialHealthUseCase = new AnalyzeFinancialHealthUseCase(
    incomeRepository,
    expenseRepository,
    aiProvider,
    fallbackProvider,
    financialReportService,
  );

  return {
    authController: new AuthController(registerUserUseCase, loginUseCase),
    incomeController: new IncomeController(createIncomeUseCase, listIncomesUseCase, updateIncomeUseCase, deleteIncomeUseCase),
    expenseController: new ExpenseController(createExpenseUseCase, listExpensesUseCase, updateExpenseUseCase, deleteExpenseUseCase),
    reportController: new ReportController(getDashboardReportUseCase),
    analysisController: new AnalysisController(analyzeFinancialHealthUseCase),
  };
};
