import type { Expense } from "../entities/expense.js";
import type { ExpenseCategory } from "../../shared/constants/expense-categories.js";
import type { DateRangeFilter } from "./income-repository.js";

export interface CreateExpenseParams {
  title: string;
  amountInCents: number;
  spentAt: Date;
  category: ExpenseCategory;
  userId: string;
}

export interface IExpenseRepository {
  create(params: CreateExpenseParams): Promise<Expense>;
  listByUser(userId: string, filter?: DateRangeFilter): Promise<Expense[]>;
}

