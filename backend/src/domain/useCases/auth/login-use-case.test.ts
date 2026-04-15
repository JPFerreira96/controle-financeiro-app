import { describe, it, expect, beforeEach } from "vitest";
import { LoginUseCase } from "./login-use-case.js";
import { PasswordService } from "../../../application/services/password-service.js";
import { MockUserRepository } from "../../../infrastructure/repositories/mock-user-repository.js";
import { inMemoryStore } from "../../../infrastructure/repositories/in-memory-store.js";

describe("LoginUseCase", () => {
  let useCase: LoginUseCase;
  const passwordService = new PasswordService();
  const mockSignToken = (payload: { sub: string; email: string; name: string }) =>
    `mock-token-${payload.sub}`;

  beforeEach(async () => {
    inMemoryStore.users = [];
    const userRepository = new MockUserRepository();
    useCase = new LoginUseCase(userRepository, passwordService, mockSignToken);

    // Seed a user
    const hash = await passwordService.hash("correct-password");
    inMemoryStore.users.push({
      id: "user-1",
      name: "Test User",
      email: "test@test.com",
      passwordHash: hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it("should login successfully with correct credentials", async () => {
    const result = await useCase.execute({
      email: "test@test.com",
      password: "correct-password",
    });

    expect(result.token).toContain("mock-token-user-1");
    expect(result.user).toMatchObject({
      id: "user-1",
      name: "Test User",
      email: "test@test.com",
    });
  });

  it("should throw if email does not exist", async () => {
    await expect(
      useCase.execute({
        email: "nobody@test.com",
        password: "password",
      }),
    ).rejects.toThrow("Credenciais invalidas.");
  });

  it("should throw if password is wrong", async () => {
    await expect(
      useCase.execute({
        email: "test@test.com",
        password: "wrong-password",
      }),
    ).rejects.toThrow("Credenciais invalidas.");
  });
});
