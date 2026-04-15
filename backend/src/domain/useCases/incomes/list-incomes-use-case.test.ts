import { describe, it, expect, beforeEach } from "vitest";
import { ListIncomesUseCase } from "./list-incomes-use-case.js";
import { MockIncomeRepository } from "../../../infrastructure/repositories/mock-income-repository.js";
import { inMemoryStore } from "../../../infrastructure/repositories/in-memory-store.js";

describe("ListIncomesUseCase", () => {
  let useCase: ListIncomesUseCase;

  beforeEach(() => {
    inMemoryStore.incomes = [];
    useCase = new ListIncomesUseCase(new MockIncomeRepository());
  });

  it("should return empty array when user has no incomes", async () => {
    const result = await useCase.execute("user-1");
    expect(result).toEqual([]);
  });

  it("should return only incomes from the given user", async () => {
    const now = new Date();
    inMemoryStore.incomes.push(
      {
        id: "inc-1",
        title: "Salario",
        amountInCents: 500000,
        receivedAt: now,
        userId: "user-1",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "inc-2",
        title: "Freelance",
        amountInCents: 200000,
        receivedAt: now,
        userId: "user-2",
        createdAt: now,
        updatedAt: now,
      },
    );

    const result = await useCase.execute("user-1");
    expect(result).toHaveLength(1);
    expect(result[0]!.title).toBe("Salario");
    expect(result[0]!.amount).toBe(5000);
  });

  it("should include computed amount from cents", async () => {
    const now = new Date();
    inMemoryStore.incomes.push({
      id: "inc-1",
      title: "Test",
      amountInCents: 123456,
      receivedAt: now,
      userId: "user-1",
      createdAt: now,
      updatedAt: now,
    });

    const result = await useCase.execute("user-1");
    expect(result[0]!.amount).toBe(1234.56);
    expect(result[0]!.amountInCents).toBe(123456);
  });
});
