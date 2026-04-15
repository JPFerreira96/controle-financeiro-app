import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import isBetween from "dayjs/plugin/isBetween.js";

import type { DashboardReportDTO } from "../dtos/financial-dtos.js";
import type { Income } from "../../domain/entities/income.js";
import type { Expense } from "../../domain/entities/expense.js";
import type { AIAnalysisInput } from "../../domain/providers/ai-provider.js";
import {
  CATEGORY_LABELS,
  EXPENSE_CATEGORIES,
} from "../../shared/constants/expense-categories.js";
import { fromCents, roundCurrency } from "../../shared/utils/money.js";

dayjs.extend(isoWeek);
dayjs.extend(isBetween);

const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

interface BuildReportInput {
  incomes: Income[];
  expenses: Expense[];
  year?: number;
  month?: number;
}

export class FinancialReportService {
  buildDashboard({ incomes, expenses, year, month }: BuildReportInput): DashboardReportDTO {
    const selectedYear = year ?? dayjs().year();
    const selectedMonth = month ?? dayjs().month() + 1;
    const selectedPeriodStart = dayjs(`${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`);
    const selectedPeriodEnd = selectedPeriodStart.endOf("month");

    const monthlyIncomes = incomes.filter((income) => {
      const date = dayjs(income.receivedAt);
      return date.isBetween(selectedPeriodStart, selectedPeriodEnd, null, "[]");
    });

    const monthlyExpenses = expenses.filter((expense) => {
      const date = dayjs(expense.spentAt);
      return date.isBetween(selectedPeriodStart, selectedPeriodEnd, null, "[]");
    });

    const totalIncome = this.sumByAmount(incomes);
    const totalExpense = this.sumByAmount(expenses);
    const monthlyIncome = this.sumByAmount(monthlyIncomes);
    const monthlyExpense = this.sumByAmount(monthlyExpenses);
    const currentBalance = roundCurrency(totalIncome - totalExpense);
    const monthlyBalance = roundCurrency(monthlyIncome - monthlyExpense);

    return {
      currentBalance,
      totalIncome,
      totalExpense,
      monthlyIncome,
      monthlyExpense,
      monthlyBalance,
      charts: {
        weeklyExpenses: this.buildWeeklyExpensesChart(monthlyExpenses, selectedYear, selectedMonth),
        monthlyExpenses: this.buildMonthlyExpensesChart(expenses, selectedYear),
        yearlyExpenses: this.buildYearlyExpensesChart(expenses, selectedYear),
        categoryExpenses: this.buildCategoryChart(monthlyExpenses, monthlyExpense),
        incomeVsExpense: this.buildIncomeVsExpenseChart(incomes, expenses, selectedYear),
        balanceEvolution: this.buildBalanceEvolutionChart(incomes, expenses, selectedYear),
      },
      summaries: {
        monthly: this.buildMonthlySummary(selectedYear, selectedMonth, monthlyIncome, monthlyExpense, monthlyBalance),
        annual: this.buildAnnualSummary(selectedYear, incomes, expenses),
      },
    };
  }

  buildAIInput({ incomes, expenses, year, month }: BuildReportInput): AIAnalysisInput {
    const selectedYear = year ?? dayjs().year();
    const selectedMonth = month ?? dayjs().month() + 1;
    const selectedPeriodStart = dayjs(`${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`);
    const selectedPeriodEnd = selectedPeriodStart.endOf("month");

    const monthlyIncomes = incomes.filter((income) => {
      const date = dayjs(income.receivedAt);
      return date.isBetween(selectedPeriodStart, selectedPeriodEnd, null, "[]");
    });

    const monthlyExpenses = expenses.filter((expense) => {
      const date = dayjs(expense.spentAt);
      return date.isBetween(selectedPeriodStart, selectedPeriodEnd, null, "[]");
    });

    const monthlyIncome = this.sumByAmount(monthlyIncomes);
    const monthlyExpense = this.sumByAmount(monthlyExpenses);
    const monthlyBalance = roundCurrency(monthlyIncome - monthlyExpense);
    const expenseRatio = monthlyIncome > 0 ? roundCurrency(monthlyExpense / monthlyIncome) : 0;

    return {
      month: selectedMonth,
      year: selectedYear,
      monthlyIncome,
      monthlyExpense,
      monthlyBalance,
      expenseRatio,
      categorySpending: EXPENSE_CATEGORIES.map((category) => ({
        category,
        total: roundCurrency(
          monthlyExpenses
            .filter((expense) => expense.category === category)
            .reduce((sum, expense) => sum + fromCents(expense.amountInCents), 0),
        ),
      })),
    };
  }

  private sumByAmount(items: Array<{ amountInCents: number }>): number {
    const total = items.reduce((sum, item) => sum + fromCents(item.amountInCents), 0);
    return roundCurrency(total);
  }

  private buildWeeklyExpensesChart(expenses: Expense[], year: number, month: number): DashboardReportDTO["charts"]["weeklyExpenses"] {
    const lastDay = dayjs(`${year}-${String(month).padStart(2, "0")}-01`).endOf("month");

    return Array.from({ length: 7 }, (_, index) => {
      const day = lastDay.subtract(6 - index, "day");
      const total = expenses
        .filter((expense) => dayjs(expense.spentAt).isSame(day, "day"))
        .reduce((sum, expense) => sum + fromCents(expense.amountInCents), 0);

      return {
        label: day.format("DD/MM"),
        total: roundCurrency(total),
      };
    });
  }

  private buildMonthlyExpensesChart(expenses: Expense[], year: number): DashboardReportDTO["charts"]["monthlyExpenses"] {
    return MONTH_LABELS.map((label, index) => {
      const month = index + 1;
      const total = expenses
        .filter((expense) => {
          const date = dayjs(expense.spentAt);
          return date.year() === year && date.month() + 1 === month;
        })
        .reduce((sum, expense) => sum + fromCents(expense.amountInCents), 0);

      return {
        label,
        total: roundCurrency(total),
      };
    });
  }

  private buildYearlyExpensesChart(expenses: Expense[], year: number): DashboardReportDTO["charts"]["yearlyExpenses"] {
    return Array.from({ length: 5 }, (_, index) => year - 4 + index).map((targetYear) => {
      const total = expenses
        .filter((expense) => dayjs(expense.spentAt).year() === targetYear)
        .reduce((sum, expense) => sum + fromCents(expense.amountInCents), 0);

      return {
        label: String(targetYear),
        total: roundCurrency(total),
      };
    });
  }

  private buildCategoryChart(
    expenses: Expense[],
    monthlyExpense: number,
  ): DashboardReportDTO["charts"]["categoryExpenses"] {
    return EXPENSE_CATEGORIES.map((category) => {
      const total = expenses
        .filter((expense) => expense.category === category)
        .reduce((sum, expense) => sum + fromCents(expense.amountInCents), 0);
      const normalizedTotal = roundCurrency(total);

      return {
        category,
        label: CATEGORY_LABELS[category],
        total: normalizedTotal,
        percentage: monthlyExpense > 0 ? roundCurrency((normalizedTotal / monthlyExpense) * 100) : 0,
      };
    });
  }

  private buildIncomeVsExpenseChart(
    incomes: Income[],
    expenses: Expense[],
    year: number,
  ): DashboardReportDTO["charts"]["incomeVsExpense"] {
    return MONTH_LABELS.map((monthLabel, index) => {
      const month = index + 1;
      const income = incomes
        .filter((item) => {
          const date = dayjs(item.receivedAt);
          return date.year() === year && date.month() + 1 === month;
        })
        .reduce((sum, item) => sum + fromCents(item.amountInCents), 0);
      const expense = expenses
        .filter((item) => {
          const date = dayjs(item.spentAt);
          return date.year() === year && date.month() + 1 === month;
        })
        .reduce((sum, item) => sum + fromCents(item.amountInCents), 0);

      return {
        month: monthLabel,
        income: roundCurrency(income),
        expense: roundCurrency(expense),
      };
    });
  }

  private buildBalanceEvolutionChart(
    incomes: Income[],
    expenses: Expense[],
    year: number,
  ): DashboardReportDTO["charts"]["balanceEvolution"] {
    let runningBalance = 0;

    return MONTH_LABELS.map((monthLabel, index) => {
      const month = index + 1;
      const monthlyIncome = incomes
        .filter((item) => {
          const date = dayjs(item.receivedAt);
          return date.year() === year && date.month() + 1 === month;
        })
        .reduce((sum, item) => sum + fromCents(item.amountInCents), 0);
      const monthlyExpense = expenses
        .filter((item) => {
          const date = dayjs(item.spentAt);
          return date.year() === year && date.month() + 1 === month;
        })
        .reduce((sum, item) => sum + fromCents(item.amountInCents), 0);

      runningBalance = roundCurrency(runningBalance + monthlyIncome - monthlyExpense);

      return {
        month: monthLabel,
        balance: runningBalance,
      };
    });
  }

  private buildMonthlySummary(year: number, month: number, income: number, expense: number, balance: number): string {
    const monthLabel = MONTH_LABELS[month - 1];
    const balanceDirection = balance >= 0 ? "positivo" : "negativo";
    return `Resumo mensal (${monthLabel}/${year}): receitas de R$ ${income.toFixed(2)}, despesas de R$ ${expense.toFixed(
      2,
    )}, saldo ${balanceDirection} de R$ ${Math.abs(balance).toFixed(2)}.`;
  }

  private buildAnnualSummary(year: number, incomes: Income[], expenses: Expense[]): string {
    const annualIncome = incomes
      .filter((item) => dayjs(item.receivedAt).year() === year)
      .reduce((sum, item) => sum + fromCents(item.amountInCents), 0);
    const annualExpense = expenses
      .filter((item) => dayjs(item.spentAt).year() === year)
      .reduce((sum, item) => sum + fromCents(item.amountInCents), 0);
    const annualBalance = annualIncome - annualExpense;
    const performance = annualBalance >= 0 ? "equilibrado" : "em deficit";

    return `Resumo anual (${year}): receitas de R$ ${roundCurrency(annualIncome).toFixed(
      2,
    )}, despesas de R$ ${roundCurrency(annualExpense).toFixed(2)} e resultado ${performance} de R$ ${Math.abs(
      roundCurrency(annualBalance),
    ).toFixed(2)}.`;
  }
}
