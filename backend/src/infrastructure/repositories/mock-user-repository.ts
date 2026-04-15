import { randomUUID } from "node:crypto";

import type { CreateUserParams, IUserRepository } from "../../domain/repositories/user-repository.js";
import { inMemoryStore } from "./in-memory-store.js";

export class MockUserRepository implements IUserRepository {
  async create(params: CreateUserParams) {
    const now = new Date();
    const user = {
      id: randomUUID(),
      name: params.name,
      email: params.email,
      passwordHash: params.passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    inMemoryStore.users.push(user);
    return user;
  }

  async findByEmail(email: string) {
    return inMemoryStore.users.find((user) => user.email === email) ?? null;
  }

  async findById(id: string) {
    return inMemoryStore.users.find((user) => user.id === id) ?? null;
  }
}
