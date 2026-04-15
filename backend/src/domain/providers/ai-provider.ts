import type { ExpenseCategory } from "../../shared/constants/expense-categories.js";

export type FinancialSituation = "CRITICO" | "ATENCAO" | "BOM" | "OTIMO";

export interface AIAnalysisInput {
  month: number;
  year: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyBalance: number;
  expenseRatio: number;
  categorySpending: Array<{ category: ExpenseCategory; total: number }>;
}

export interface AIAnalysisOutput {
  situation: FinancialSituation;
  excessiveCategories: string[];
  controlledCategories: string[];
  suggestions: string[];
  monthlySummary: string;
}

export interface IAIProvider {
  readonly name: string;
  analyzeFinancialHealth(input: AIAnalysisInput): Promise<AIAnalysisOutput>;
}

