import type { IIncomeRepository } from "../../repositories/income-repository.js";
import type { IExpenseRepository } from "../../repositories/expense-repository.js";
import type { IAIProvider } from "../../providers/ai-provider.js";
import { FinancialReportService } from "../../../application/services/financial-report-service.js";

interface AnalyzeInput {
  userId: string;
  year?: number;
  month?: number;
}

export class AnalyzeFinancialHealthUseCase {
  constructor(
    private readonly incomeRepository: IIncomeRepository,
    private readonly expenseRepository: IExpenseRepository,
    private readonly aiProvider: IAIProvider,
    private readonly fallbackAIProvider: IAIProvider,
    private readonly financialReportService: FinancialReportService,
  ) {}

  async execute(input: AnalyzeInput) {
    const [incomes, expenses] = await Promise.all([
      this.incomeRepository.listByUser(input.userId),
      this.expenseRepository.listByUser(input.userId),
    ]);

    const aiInput = this.financialReportService.buildAIInput({
      incomes,
      expenses,
      year: input.year,
      month: input.month,
    });

    try {
      const analysis = await this.aiProvider.analyzeFinancialHealth(aiInput);

      return {
        ...analysis,
        provider: this.aiProvider.name,
        period: {
          month: aiInput.month,
          year: aiInput.year,
        },
      };
    } catch {
      const analysis = await this.fallbackAIProvider.analyzeFinancialHealth(aiInput);

      return {
        ...analysis,
        provider: `${this.aiProvider.name} (fallback:${this.fallbackAIProvider.name})`,
        period: {
          month: aiInput.month,
          year: aiInput.year,
        },
      };
    }
  }
}

