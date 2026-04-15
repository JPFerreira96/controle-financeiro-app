import { describe, it, expect, beforeEach } from "vitest";
import { RegisterUserUseCase } from "./register-user-use-case.js";
import { PasswordService } from "../../../application/services/password-service.js";
import { MockUserRepository } from "../../../infrastructure/repositories/mock-user-repository.js";
import { inMemoryStore } from "../../../infrastructure/repositories/in-memory-store.js";

describe("RegisterUserUseCase", () => {
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    inMemoryStore.users = [];
    const userRepository = new MockUserRepository();
    const passwordService = new PasswordService();
    useCase = new RegisterUserUseCase(userRepository, passwordService);
  });

  it("should register a new user successfully", async () => {
    const result = await useCase.execute({
      name: "Julio",
      email: "julio@test.com",
      password: "password123",
    });

    expect(result).toMatchObject({
      name: "Julio",
      email: "julio@test.com",
    });
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect((result as unknown as Record<string, unknown>)["passwordHash"]).toBeUndefined();
  });

  it("should throw 409 if email is already registered", async () => {
    await useCase.execute({
      name: "User One",
      email: "duplicate@test.com",
      password: "password123",
    });

    await expect(
      useCase.execute({
        name: "User Two",
        email: "duplicate@test.com",
        password: "password456",
      }),
    ).rejects.toThrow("Email ja cadastrado.");
  });
});
