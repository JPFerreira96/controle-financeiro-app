import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { LoginUseCase } from "../../domain/useCases/auth/login-use-case.js";
import { RegisterUserUseCase } from "../../domain/useCases/auth/register-user-use-case.js";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  register = async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = registerSchema.parse(request.body);
    const user = await this.registerUserUseCase.execute(payload);

    return reply.status(201).send({
      user,
      message: "Usuario criado com sucesso.",
    });
  };

  login = async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = loginSchema.parse(request.body);
    const result = await this.loginUseCase.execute(payload);

    return reply.send(result);
  };
}

