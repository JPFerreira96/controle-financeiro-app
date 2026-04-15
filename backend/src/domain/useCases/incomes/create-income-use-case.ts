import type { IIncomeRepository } from "../../repositories/income-repository.js";
import { AppError } from "../../../shared/errors/app-error.js";
import { fromCents, toCents } from "../../../shared/utils/money.js";

interface CreateIncomeInput {
  title: string;
  amount: number;
  receivedAt?: Date;
  userId: string;
}

export class CreateIncomeUseCase {
  constructor(private readonly incomeRepository: IIncomeRepository) {}

  async execute(input: CreateIncomeInput) {
    if (input.amount <= 0) {
      throw new AppError("O valor da receita deve ser maior que zero.");
    }

    const income = await this.incomeRepository.create({
      title: input.title,
      amountInCents: toCents(input.amount),
      receivedAt: input.receivedAt ?? new Date(),
      userId: input.userId,
    });

    return {
      ...income,
      amount: fromCents(income.amountInCents),
    };
  }
}

