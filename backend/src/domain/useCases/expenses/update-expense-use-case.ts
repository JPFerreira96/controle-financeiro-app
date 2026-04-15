import type { IExpenseRepository } from "../../repositories/expense-repository.js";
import type { ExpenseCategory } from "../../../shared/constants/expense-categories.js";
import { AppError } from "../../../shared/errors/app-error.js";
import { fromCents, toCents } from "../../../shared/utils/money.js";

interface UpdateExpenseInput {
  id: string;
  userId: string;
  title?: string;
  amount?: number;
  spentAt?: Date;
  category?: ExpenseCategory;
}

export class UpdateExpenseUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(input: UpdateExpenseInput) {
    const existing = await this.expenseRepository.findById(input.id, input.userId);
    if (!existing) {
      throw new AppError("Despesa nao encontrada.", 404);
    }

    if (input.amount !== undefined && input.amount <= 0) {
      throw new AppError("O valor da despesa deve ser maior que zero.");
    }

    const expense = await this.expenseRepository.update(input.id, input.userId, {
      title: input.title,
      amountInCents: input.amount !== undefined ? toCents(input.amount) : undefined,
      spentAt: input.spentAt,
      category: input.category,
    });

    return {
      ...expense,
      amount: fromCents(expense.amountInCents),
    };
  }
}
