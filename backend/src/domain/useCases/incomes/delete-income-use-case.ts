import type { IIncomeRepository } from "../../repositories/income-repository.js";
import { AppError } from "../../../shared/errors/app-error.js";

interface DeleteIncomeInput {
  id: string;
  userId: string;
}

export class DeleteIncomeUseCase {
  constructor(private readonly incomeRepository: IIncomeRepository) {}

  async execute(input: DeleteIncomeInput) {
    const existing = await this.incomeRepository.findById(input.id, input.userId);
    if (!existing) {
      throw new AppError("Receita nao encontrada.", 404);
    }

    await this.incomeRepository.delete(input.id, input.userId);
  }
}
