import type { IExpenseRepository } from "../../repositories/expense-repository.js";
import { AppError } from "../../../shared/errors/app-error.js";

interface DeleteExpenseInput {
  id: string;
  userId: string;
}

export class DeleteExpenseUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(input: DeleteExpenseInput) {
    const existing = await this.expenseRepository.findById(input.id, input.userId);
    if (!existing) {
      throw new AppError("Despesa nao encontrada.", 404);
    }

    await this.expenseRepository.delete(input.id, input.userId);
  }
}
