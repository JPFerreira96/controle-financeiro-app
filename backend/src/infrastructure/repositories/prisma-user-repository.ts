import type { PrismaClient } from "@prisma/client";

import type { IUserRepository, CreateUserParams } from "../../domain/repositories/user-repository.js";

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create(params: CreateUserParams) {
    return this.prisma.user.create({
      data: params,
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}

