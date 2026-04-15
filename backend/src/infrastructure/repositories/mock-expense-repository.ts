import { randomUUID } from "node:crypto";

import type {
  CreateExpenseParams,
  UpdateExpenseParams,
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

  async findById(id: string, userId: string) {
    return inMemoryStore.expenses.find((e) => e.id === id && e.userId === userId) ?? null;
  }

  async update(id: string, userId: string, params: UpdateExpenseParams) {
    const index = inMemoryStore.expenses.findIndex((e) => e.id === id && e.userId === userId);
    if (index === -1) throw new Error("Expense not found");
    const updated = {
      ...inMemoryStore.expenses[index]!,
      title: params.title ?? inMemoryStore.expenses[index]!.title,
      amountInCents: params.amountInCents ?? inMemoryStore.expenses[index]!.amountInCents,
      spentAt: params.spentAt ?? inMemoryStore.expenses[index]!.spentAt,
      category: params.category ?? inMemoryStore.expenses[index]!.category,
      updatedAt: new Date(),
    };
    inMemoryStore.expenses[index] = updated;
    return updated;
  }

  async delete(id: string, userId: string) {
    const index = inMemoryStore.expenses.findIndex((e) => e.id === id && e.userId === userId);
    if (index === -1) throw new Error("Expense not found");
    inMemoryStore.expenses.splice(index, 1);
  }
}
