import type { IIncomeRepository } from "../../repositories/income-repository.js";
import type { IExpenseRepository } from "../../repositories/expense-repository.js";
import { FinancialReportService } from "../../../application/services/financial-report-service.js";

interface GetDashboardInput {
  userId: string;
  year?: number;
  month?: number;
}

export class GetDashboardReportUseCase {
  constructor(
    private readonly incomeRepository: IIncomeRepository,
    private readonly expenseRepository: IExpenseRepository,
    private readonly financialReportService: FinancialReportService,
  ) {}

  async execute(input: GetDashboardInput) {
    const [incomes, expenses] = await Promise.all([
      this.incomeRepository.listByUser(input.userId),
      this.expenseRepository.listByUser(input.userId),
    ]);

    return this.financialReportService.buildDashboard({
      incomes,
      expenses,
      year: input.year,
      month: input.month,
    });
  }
}

