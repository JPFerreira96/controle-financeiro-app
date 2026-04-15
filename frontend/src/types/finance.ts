export type ExpenseCategory =
  | "ALIMENTACAO"
  | "TRANSPORTE"
  | "LAZER"
  | "MORADIA"
  | "SAUDE"
  | "EDUCACAO"
  | "CONTAS"
  | "OUTROS";

export interface Income {
  id: string;
  title: string;
  amount: number;
  receivedAt: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  spentAt: string;
  category: ExpenseCategory;
  createdAt: string;
}

export interface DashboardReport {
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyBalance: number;
  charts: {
    weeklyExpenses: Array<{ label: string; total: number }>;
    monthlyExpenses: Array<{ label: string; total: number }>;
    yearlyExpenses: Array<{ label: string; total: number }>;
    categoryExpenses: Array<{ category: ExpenseCategory; label: string; total: number; percentage: number }>;
    incomeVsExpense: Array<{ month: string; income: number; expense: number }>;
    balanceEvolution: Array<{ month: string; balance: number }>;
  };
  summaries: {
    monthly: string;
    annual: string;
  };
}

export interface FinancialHealthAnalysis {
  situation: "CRITICO" | "ATENCAO" | "BOM" | "OTIMO";
  excessiveCategories: string[];
  controlledCategories: string[];
  suggestions: string[];
  monthlySummary: string;
  provider: string;
  period: {
    month: number;
    year: number;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

