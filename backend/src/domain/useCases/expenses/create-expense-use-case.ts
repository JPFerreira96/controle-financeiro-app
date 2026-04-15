import type { IExpenseRepository } from "../../repositories/expense-repository.js";
import type { ExpenseCategory } from "../../../shared/constants/expense-categories.js";
import { AppError } from "../../../shared/errors/app-error.js";
import { fromCents, toCents } from "../../../shared/utils/money.js";

interface CreateExpenseInput {
  title: string;
  amount: number;
  spentAt?: Date;
  category: ExpenseCategory;
  userId: string;
}

export class CreateExpenseUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(input: CreateExpenseInput) {
    if (input.amount <= 0) {
      throw new AppError("O valor da despesa deve ser maior que zero.");
    }

    const expense = await this.expenseRepository.create({
      title: input.title,
      amountInCents: toCents(input.amount),
      spentAt: input.spentAt ?? new Date(),
      category: input.category,
      userId: input.userId,
    });

    return {
      ...expense,
      amount: fromCents(expense.amountInCents),
    };
  }
}

