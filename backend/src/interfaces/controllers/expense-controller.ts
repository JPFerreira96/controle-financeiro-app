import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { EXPENSE_CATEGORIES } from "../../shared/constants/expense-categories.js";
import { CreateExpenseUseCase } from "../../domain/useCases/expenses/create-expense-use-case.js";
import { ListExpensesUseCase } from "../../domain/useCases/expenses/list-expenses-use-case.js";
import { UpdateExpenseUseCase } from "../../domain/useCases/expenses/update-expense-use-case.js";
import { DeleteExpenseUseCase } from "../../domain/useCases/expenses/delete-expense-use-case.js";

const createExpenseSchema = z.object({
  title: z.string().min(2),
  amount: z.number().positive(),
  spentAt: z.coerce.date().optional(),
  category: z.enum(EXPENSE_CATEGORIES),
});

const updateExpenseSchema = z.object({
  title: z.string().min(2).optional(),
  amount: z.number().positive().optional(),
  spentAt: z.coerce.date().optional(),
  category: z.enum(EXPENSE_CATEGORIES).optional(),
});

const idParamSchema = z.object({
  id: z.string().min(1),
});

export class ExpenseController {
  constructor(
    private readonly createExpenseUseCase: CreateExpenseUseCase,
    private readonly listExpensesUseCase: ListExpensesUseCase,
    private readonly updateExpenseUseCase: UpdateExpenseUseCase,
    private readonly deleteExpenseUseCase: DeleteExpenseUseCase,
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

  update = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = idParamSchema.parse(request.params);
    const payload = updateExpenseSchema.parse(request.body);
    const userId = request.user.sub;

    const expense = await this.updateExpenseUseCase.execute({
      id,
      userId,
      ...payload,
    });

    return reply.send(expense);
  };

  delete = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = idParamSchema.parse(request.params);
    const userId = request.user.sub;

    await this.deleteExpenseUseCase.execute({ id, userId });

    return reply.status(204).send();
  };
}

