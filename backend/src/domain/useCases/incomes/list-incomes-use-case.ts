import type { IIncomeRepository } from "../../repositories/income-repository.js";
import { fromCents } from "../../../shared/utils/money.js";

export class ListIncomesUseCase {
  constructor(private readonly incomeRepository: IIncomeRepository) {}

  async execute(userId: string) {
    const incomes = await this.incomeRepository.listByUser(userId);

    return incomes.map((income) => ({
      ...income,
      amount: fromCents(income.amountInCents),
    }));
  }
}

