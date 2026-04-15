import { randomUUID } from "node:crypto";

import type {
  CreateIncomeParams,
  DateRangeFilter,
  IIncomeRepository,
} from "../../domain/repositories/income-repository.js";
import { inMemoryStore } from "./in-memory-store.js";

export class MockIncomeRepository implements IIncomeRepository {
  async create(params: CreateIncomeParams) {
    const now = new Date();
    const income = {
      id: randomUUID(),
      title: params.title,
      amountInCents: params.amountInCents,
      receivedAt: params.receivedAt,
      userId: params.userId,
      createdAt: now,
      updatedAt: now,
    };

    inMemoryStore.incomes.push(income);
    return income;
  }

  async listByUser(userId: string, filter?: DateRangeFilter) {
    return inMemoryStore.incomes
      .filter((income) => income.userId === userId)
      .filter((income) => this.matchesDateFilter(income.receivedAt, filter))
      .sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime());
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
