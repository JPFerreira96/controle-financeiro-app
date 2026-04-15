import type { ExpenseCategory } from "../../shared/constants/expense-categories.js";

export interface ChartPointDTO {
  label: string;
  total: number;
}

export interface CategoryChartPointDTO {
  category: ExpenseCategory;
  label: string;
  total: number;
  percentage: number;
}

export interface MonthlyComparisonDTO {
  month: string;
  income: number;
  expense: number;
}

export interface BalanceEvolutionDTO {
  month: string;
  balance: number;
}

export interface DashboardReportDTO {
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyBalance: number;
  charts: {
    weeklyExpenses: ChartPointDTO[];
    monthlyExpenses: ChartPointDTO[];
    yearlyExpenses: ChartPointDTO[];
    categoryExpenses: CategoryChartPointDTO[];
    incomeVsExpense: MonthlyComparisonDTO[];
    balanceEvolution: BalanceEvolutionDTO[];
  };
  summaries: {
    monthly: string;
    annual: string;
  };
}

