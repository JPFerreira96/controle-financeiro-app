import type { FastifyReply, FastifyRequest } from "fastify";

export const authenticate = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    await request.jwtVerify();
  } catch {
    reply.status(401).send({
      message: "Nao autorizado.",
    });
  }
};

