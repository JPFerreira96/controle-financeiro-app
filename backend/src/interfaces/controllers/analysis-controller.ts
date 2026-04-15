import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { AnalyzeFinancialHealthUseCase } from "../../domain/useCases/analysis/analyze-financial-health-use-case.js";

const analysisQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
});

export class AnalysisController {
  constructor(private readonly analyzeFinancialHealthUseCase: AnalyzeFinancialHealthUseCase) {}

  financialHealth = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.sub;
    const query = analysisQuerySchema.parse(request.query);

    const analysis = await this.analyzeFinancialHealthUseCase.execute({
      userId,
      year: query.year,
      month: query.month,
    });

    return reply.send(analysis);
  };
}

