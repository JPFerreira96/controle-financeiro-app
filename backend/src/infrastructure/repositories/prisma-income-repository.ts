import type { PrismaClient } from "@prisma/client";

import type {
  IIncomeRepository,
  CreateIncomeParams,
  UpdateIncomeParams,
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

  findById(id: string, userId: string) {
    return this.prisma.income.findFirst({
      where: { id, userId },
    });
  }

  async update(id: string, userId: string, params: UpdateIncomeParams) {
    const existing = await this.prisma.income.findFirst({ where: { id, userId } });
    if (!existing) throw new Error("Income not found");
    return this.prisma.income.update({
      where: { id },
      data: params,
    });
  }

  async delete(id: string, userId: string) {
    const existing = await this.prisma.income.findFirst({ where: { id, userId } });
    if (!existing) throw new Error("Income not found");
    await this.prisma.income.delete({
      where: { id },
    });
  }
}

