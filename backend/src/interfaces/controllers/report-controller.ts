import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { GetDashboardReportUseCase } from "../../domain/useCases/reports/get-dashboard-report-use-case.js";

const reportQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
});

export class ReportController {
  constructor(private readonly getDashboardReportUseCase: GetDashboardReportUseCase) {}

  dashboard = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.sub;
    const query = reportQuerySchema.parse(request.query);

    const report = await this.getDashboardReportUseCase.execute({
      userId,
      year: query.year,
      month: query.month,
    });

    return reply.send(report);
  };

  monthlySummary = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.sub;
    const query = reportQuerySchema.parse(request.query);

    const report = await this.getDashboardReportUseCase.execute({
      userId,
      year: query.year,
      month: query.month,
    });

    return reply.send({
      summary: report.summaries.monthly,
      month: query.month,
      year: query.year,
    });
  };

  annualSummary = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.sub;
    const query = reportQuerySchema.parse(request.query);

    const report = await this.getDashboardReportUseCase.execute({
      userId,
      year: query.year,
      month: query.month,
    });

    return reply.send({
      summary: report.summaries.annual,
      year: query.year,
    });
  };

  charts = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.sub;
    const query = reportQuerySchema.parse(request.query);

    const report = await this.getDashboardReportUseCase.execute({
      userId,
      year: query.year,
      month: query.month,
    });

    return reply.send(report.charts);
  };
}

