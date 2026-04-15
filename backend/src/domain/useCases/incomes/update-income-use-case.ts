import type { IIncomeRepository } from "../../repositories/income-repository.js";
import { AppError } from "../../../shared/errors/app-error.js";
import { fromCents, toCents } from "../../../shared/utils/money.js";

interface UpdateIncomeInput {
  id: string;
  userId: string;
  title?: string;
  amount?: number;
  receivedAt?: Date;
}

export class UpdateIncomeUseCase {
  constructor(private readonly incomeRepository: IIncomeRepository) {}

  async execute(input: UpdateIncomeInput) {
    const existing = await this.incomeRepository.findById(input.id, input.userId);
    if (!existing) {
      throw new AppError("Receita nao encontrada.", 404);
    }

    if (input.amount !== undefined && input.amount <= 0) {
      throw new AppError("O valor da receita deve ser maior que zero.");
    }

    const income = await this.incomeRepository.update(input.id, input.userId, {
      title: input.title,
      amountInCents: input.amount !== undefined ? toCents(input.amount) : undefined,
      receivedAt: input.receivedAt,
    });

    return {
      ...income,
      amount: fromCents(income.amountInCents),
    };
  }
}
