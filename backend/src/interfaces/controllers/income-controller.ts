import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { CreateIncomeUseCase } from "../../domain/useCases/incomes/create-income-use-case.js";
import { ListIncomesUseCase } from "../../domain/useCases/incomes/list-incomes-use-case.js";

const createIncomeSchema = z.object({
  title: z.string().min(2),
  amount: z.number().positive(),
  receivedAt: z.coerce.date().optional(),
});

export class IncomeController {
  constructor(
    private readonly createIncomeUseCase: CreateIncomeUseCase,
    private readonly listIncomesUseCase: ListIncomesUseCase,
  ) {}

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = createIncomeSchema.parse(request.body);
    const userId = request.user.sub;

    const income = await this.createIncomeUseCase.execute({
      ...payload,
      userId,
    });

    return reply.status(201).send(income);
  };

  list = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.sub;
    const incomes = await this.listIncomesUseCase.execute(userId);

    return reply.send(incomes);
  };
}

