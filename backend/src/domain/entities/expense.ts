import type { ExpenseCategory } from "../../shared/constants/expense-categories.js";

export interface Expense {
  id: string;
  title: string;
  amountInCents: number;
  spentAt: Date;
  category: ExpenseCategory;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

