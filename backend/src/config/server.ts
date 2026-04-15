import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import sensible from "@fastify/sensible";
import { ZodError } from "zod";

import { createContainer } from "./container.js";
import { env } from "./env.js";
import { prisma } from "../infrastructure/database/prisma-client.js";
import { registerRoutes } from "../interfaces/routes/index.js";
import { AppError } from "../shared/errors/app-error.js";

export const buildServer = async () => {
  const app = Fastify({
    logger: env.NODE_ENV !== "test",
  });

  await app.register(cors, {
    origin: true,
  });

  await app.register(sensible);

  await app.register(jwt, {
    secret: env.JWT_SECRET,
  });

  app.get("/health", async () => ({
    status: "ok",
    service: "controle-financeiro-api",
    timestamp: new Date().toISOString(),
  }));

  const container = createContainer(app);
  registerRoutes(app, container);

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        message: error.message,
      });
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Dados invalidos.",
        issues: error.issues,
      });
    }

    app.log.error(error);

    return reply.status(500).send({
      message: "Erro interno no servidor.",
    });
  });

  app.addHook("onClose", async () => {
    if (!env.USE_MOCK_MODE) {
      await prisma.$disconnect();
    }
  });

  return app;
};
