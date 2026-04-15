import { describe, it, expect, beforeEach } from "vitest";
import { CreateExpenseUseCase } from "./create-expense-use-case.js";
import { MockExpenseRepository } from "../../../infrastructure/repositories/mock-expense-repository.js";
import { inMemoryStore } from "../../../infrastructure/repositories/in-memory-store.js";

describe("CreateExpenseUseCase", () => {
  let useCase: CreateExpenseUseCase;

  beforeEach(() => {
    inMemoryStore.expenses = [];
    useCase = new CreateExpenseUseCase(new MockExpenseRepository());
  });

  it("should create an expense with correct data", async () => {
    const result = await useCase.execute({
      title: "Supermercado",
      amount: 150.5,
      category: "ALIMENTACAO",
      userId: "user-1",
    });

    expect(result.title).toBe("Supermercado");
    expect(result.amount).toBe(150.5);
    expect(result.amountInCents).toBe(15050);
    expect(result.category).toBe("ALIMENTACAO");
    expect(result.userId).toBe("user-1");
    expect(result.id).toBeDefined();
  });

  it("should use current date if spentAt is not provided", async () => {
    const before = new Date();
    const result = await useCase.execute({
      title: "Uber",
      amount: 25,
      category: "TRANSPORTE",
      userId: "user-1",
    });
    const after = new Date();

    expect(result.spentAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(result.spentAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it("should throw if amount is zero", async () => {
    await expect(
      useCase.execute({
        title: "Invalid",
        amount: 0,
        category: "OUTROS",
        userId: "user-1",
      }),
    ).rejects.toThrow("O valor da despesa deve ser maior que zero.");
  });

  it("should throw if amount is negative", async () => {
    await expect(
      useCase.execute({
        title: "Invalid",
        amount: -10,
        category: "OUTROS",
        userId: "user-1",
      }),
    ).rejects.toThrow("O valor da despesa deve ser maior que zero.");
  });
});
