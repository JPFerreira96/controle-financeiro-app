import { describe, it, expect, beforeEach } from "vitest";
import { CreateIncomeUseCase } from "./create-income-use-case.js";
import { MockIncomeRepository } from "../../../infrastructure/repositories/mock-income-repository.js";
import { inMemoryStore } from "../../../infrastructure/repositories/in-memory-store.js";

describe("CreateIncomeUseCase", () => {
  let useCase: CreateIncomeUseCase;

  beforeEach(() => {
    inMemoryStore.incomes = [];
    useCase = new CreateIncomeUseCase(new MockIncomeRepository());
  });

  it("should create an income with correct data", async () => {
    const result = await useCase.execute({
      title: "Salario",
      amount: 5000,
      userId: "user-1",
    });

    expect(result.title).toBe("Salario");
    expect(result.amount).toBe(5000);
    expect(result.amountInCents).toBe(500000);
    expect(result.userId).toBe("user-1");
    expect(result.id).toBeDefined();
  });

  it("should use current date if receivedAt is not provided", async () => {
    const before = new Date();
    const result = await useCase.execute({
      title: "Freelance",
      amount: 1000,
      userId: "user-1",
    });
    const after = new Date();

    expect(result.receivedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(result.receivedAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it("should accept a custom receivedAt date", async () => {
    const customDate = new Date("2025-06-15");
    const result = await useCase.execute({
      title: "Bonus",
      amount: 2000,
      receivedAt: customDate,
      userId: "user-1",
    });

    expect(result.receivedAt).toEqual(customDate);
  });

  it("should throw if amount is zero", async () => {
    await expect(
      useCase.execute({
        title: "Invalid",
        amount: 0,
        userId: "user-1",
      }),
    ).rejects.toThrow("O valor da receita deve ser maior que zero.");
  });

  it("should throw if amount is negative", async () => {
    await expect(
      useCase.execute({
        title: "Invalid",
        amount: -50,
        userId: "user-1",
      }),
    ).rejects.toThrow("O valor da receita deve ser maior que zero.");
  });
});
