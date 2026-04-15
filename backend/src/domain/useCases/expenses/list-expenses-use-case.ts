import type { IExpenseRepository } from "../../repositories/expense-repository.js";
import { fromCents } from "../../../shared/utils/money.js";

export class ListExpensesUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(userId: string) {
    const expenses = await this.expenseRepository.listByUser(userId);

    return expenses.map((expense) => ({
      ...expense,
      amount: fromCents(expense.amountInCents),
    }));
  }
}

