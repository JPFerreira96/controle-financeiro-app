import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { CreateIncomeUseCase } from "../../domain/useCases/incomes/create-income-use-case.js";
import { ListIncomesUseCase } from "../../domain/useCases/incomes/list-incomes-use-case.js";
import { UpdateIncomeUseCase } from "../../domain/useCases/incomes/update-income-use-case.js";
import { DeleteIncomeUseCase } from "../../domain/useCases/incomes/delete-income-use-case.js";

const createIncomeSchema = z.object({
  title: z.string().min(2),
  amount: z.number().positive(),
  receivedAt: z.coerce.date().optional(),
});

const updateIncomeSchema = z.object({
  title: z.string().min(2).optional(),
  amount: z.number().positive().optional(),
  receivedAt: z.coerce.date().optional(),
});

const idParamSchema = z.object({
  id: z.string().min(1),
});

export class IncomeController {
  constructor(
    private readonly createIncomeUseCase: CreateIncomeUseCase,
    private readonly listIncomesUseCase: ListIncomesUseCase,
    private readonly updateIncomeUseCase: UpdateIncomeUseCase,
    private readonly deleteIncomeUseCase: DeleteIncomeUseCase,
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

  update = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = idParamSchema.parse(request.params);
    const payload = updateIncomeSchema.parse(request.body);
    const userId = request.user.sub;

    const income = await this.updateIncomeUseCase.execute({
      id,
      userId,
      ...payload,
    });

    return reply.send(income);
  };

  delete = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = idParamSchema.parse(request.params);
    const userId = request.user.sub;

    await this.deleteIncomeUseCase.execute({ id, userId });

    return reply.status(204).send();
  };
}

