import type { PrismaClient, ExpenseCategory as PrismaExpenseCategory } from "@prisma/client";

import type {
  IExpenseRepository,
  CreateExpenseParams,
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
}

