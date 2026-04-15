import type { PrismaClient, ExpenseCategory as PrismaExpenseCategory } from "@prisma/client";

import type {
  IExpenseRepository,
  CreateExpenseParams,
  UpdateExpenseParams,
} from "../../domain/repositories/expense-repository.js";
import type { DateRangeFilter } from "../../domain/repositories/income-repository.js";

export class PrismaExpenseRepository implements IExpenseRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create(params: CreateExpenseParams) {
    return this.prisma.expense.create({
      data: {
        ...params,
        category: params.category as PrismaExpenseCategory,
      },
    });
  }

  listByUser(userId: string, filter?: DateRangeFilter) {
    return this.prisma.expense.findMany({
      where: {
        userId,
        spentAt:
          filter?.from || filter?.to
            ? {
                gte: filter.from,
                lte: filter.to,
              }
            : undefined,
      },
      orderBy: {
        spentAt: "desc",
      },
    });
  }

  findById(id: string, userId: string) {
    return this.prisma.expense.findFirst({
      where: { id, userId },
    });
  }

  async update(id: string, userId: string, params: UpdateExpenseParams) {
    const existing = await this.prisma.expense.findFirst({ where: { id, userId } });
    if (!existing) throw new Error("Expense not found");
    return this.prisma.expense.update({
      where: { id },
      data: {
        ...params,
        category: params.category as PrismaExpenseCategory | undefined,
      },
    });
  }

  async delete(id: string, userId: string) {
    const existing = await this.prisma.expense.findFirst({ where: { id, userId } });
    if (!existing) throw new Error("Expense not found");
    await this.prisma.expense.delete({
      where: { id },
    });
  }
}

