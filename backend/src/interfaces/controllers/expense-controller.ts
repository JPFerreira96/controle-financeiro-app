import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { EXPENSE_CATEGORIES } from "../../shared/constants/expense-categories.js";
import { CreateExpenseUseCase } from "../../domain/useCases/expenses/create-expense-use-case.js";
import { ListExpensesUseCase } from "../../domain/useCases/expenses/list-expenses-use-case.js";

const createExpenseSchema = z.object({
  title: z.string().min(2),
  amount: z.number().positive(),
  spentAt: z.coerce.date().optional(),
  category: z.enum(EXPENSE_CATEGORIES),
});

export class ExpenseController {
  constructor(
    private readonly createExpenseUseCase: CreateExpenseUseCase,
    private readonly listExpensesUseCase: ListExpensesUseCase,
  ) {}

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = createExpenseSchema.parse(request.body);
    const userId = request.user.sub;

    const expense = await this.createExpenseUseCase.execute({
      ...payload,
      userId,
    });

    return reply.status(201).send(expense);
  };

  list = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.sub;
    const expenses = await this.listExpensesUseCase.execute(userId);

    return reply.send(expenses);
  };
}

