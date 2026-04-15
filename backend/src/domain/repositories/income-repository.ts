import type { Income } from "../entities/income.js";

export interface CreateIncomeParams {
  title: string;
  amountInCents: number;
  receivedAt: Date;
  userId: string;
}

export interface UpdateIncomeParams {
  title?: string;
  amountInCents?: number;
  receivedAt?: Date;
}

export interface DateRangeFilter {
  from?: Date;
  to?: Date;
}

export interface IIncomeRepository {
  create(params: CreateIncomeParams): Promise<Income>;
  listByUser(userId: string, filter?: DateRangeFilter): Promise<Income[]>;
  findById(id: string, userId: string): Promise<Income | null>;
  update(id: string, userId: string, params: UpdateIncomeParams): Promise<Income>;
  delete(id: string, userId: string): Promise<void>;
}

