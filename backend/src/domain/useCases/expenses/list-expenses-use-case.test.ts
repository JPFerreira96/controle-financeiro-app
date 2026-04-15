import { describe, it, expect, beforeEach } from "vitest";
import { ListExpensesUseCase } from "./list-expenses-use-case.js";
import { MockExpenseRepository } from "../../../infrastructure/repositories/mock-expense-repository.js";
import { inMemoryStore } from "../../../infrastructure/repositories/in-memory-store.js";

describe("ListExpensesUseCase", () => {
  let useCase: ListExpensesUseCase;

  beforeEach(() => {
    inMemoryStore.expenses = [];
    useCase = new ListExpensesUseCase(new MockExpenseRepository());
  });

  it("should return empty array when user has no expenses", async () => {
    const result = await useCase.execute("user-1");
    expect(result).toEqual([]);
  });

  it("should return only expenses from the given user", async () => {
    const now = new Date();
    inMemoryStore.expenses.push(
      {
        id: "exp-1",
        title: "User 1 expense",
        amountInCents: 1000,
        spentAt: now,
        category: "ALIMENTACAO",
        userId: "user-1",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "exp-2",
        title: "User 2 expense",
        amountInCents: 2000,
        spentAt: now,
        category: "TRANSPORTE",
        userId: "user-2",
        createdAt: now,
        updatedAt: now,
      },
    );

    const result = await useCase.execute("user-1");
    expect(result).toHaveLength(1);
    expect(result[0]!.title).toBe("User 1 expense");
    expect(result[0]!.amount).toBe(10);
  });

  it("should include computed amount from cents", async () => {
    const now = new Date();
    inMemoryStore.expenses.push({
      id: "exp-1",
      title: "Test",
      amountInCents: 15050,
      spentAt: now,
      category: "LAZER",
      userId: "user-1",
      createdAt: now,
      updatedAt: now,
    });

    const result = await useCase.execute("user-1");
    expect(result[0]!.amount).toBe(150.5);
    expect(result[0]!.amountInCents).toBe(15050);
  });
});
