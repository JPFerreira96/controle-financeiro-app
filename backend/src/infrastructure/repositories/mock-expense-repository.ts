import { randomUUID } from "node:crypto";

import type {
  CreateExpenseParams,
  IExpenseRepository,
} from "../../domain/repositories/expense-repository.js";
import type { DateRangeFilter } from "../../domain/repositories/income-repository.js";
import { inMemoryStore } from "./in-memory-store.js";

export class MockExpenseRepository implements IExpenseRepository {
  async create(params: CreateExpenseParams) {
    const now = new Date();
    const expense = {
      id: randomUUID(),
      title: params.title,
      amountInCents: params.amountInCents,
      spentAt: params.spentAt,
      category: params.category,
      userId: params.userId,
      createdAt: now,
      updatedAt: now,
    };

    inMemoryStore.expenses.push(expense);
    return expense;
  }

  async listByUser(userId: string, filter?: DateRangeFilter) {
    return inMemoryStore.expenses
      .filter((expense) => expense.userId === userId)
      .filter((expense) => this.matchesDateFilter(expense.spentAt, filter))
      .sort((a, b) => b.spentAt.getTime() - a.spentAt.getTime());
  }

  private matchesDateFilter(value: Date, filter?: DateRangeFilter): boolean {
    if (!filter?.from && !filter?.to) {
      return true;
    }

    if (filter.from && value < filter.from) {
      return false;
    }

    if (filter.to && value > filter.to) {
      return false;
    }

    return true;
  }
}
