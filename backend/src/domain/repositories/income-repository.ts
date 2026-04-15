import type { Income } from "../entities/income.js";

export interface CreateIncomeParams {
  title: string;
  amountInCents: number;
  receivedAt: Date;
  userId: string;
}

export interface DateRangeFilter {
  from?: Date;
  to?: Date;
}

export interface IIncomeRepository {
  create(params: CreateIncomeParams): Promise<Income>;
  listByUser(userId: string, filter?: DateRangeFilter): Promise<Income[]>;
}

