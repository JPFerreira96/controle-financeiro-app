import type { PrismaClient } from "@prisma/client";

import type {
  IIncomeRepository,
  CreateIncomeParams,
  DateRangeFilter,
} from "../../domain/repositories/income-repository.js";

export class PrismaIncomeRepository implements IIncomeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create(params: CreateIncomeParams) {
    return this.prisma.income.create({
      data: params,
    });
  }

  listByUser(userId: string, filter?: DateRangeFilter) {
    return this.prisma.income.findMany({
      where: {
        userId,
        receivedAt:
          filter?.from || filter?.to
            ? {
                gte: filter.from,
                lte: filter.to,
              }
            : undefined,
      },
      orderBy: {
        receivedAt: "desc",
      },
    });
  }
}

