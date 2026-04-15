import { describe, it, expect } from "vitest";
import { PasswordService } from "./password-service.js";

describe("PasswordService", () => {
  const service = new PasswordService();

  it("should hash a password", async () => {
    const hash = await service.hash("my-secret-123");
    expect(hash).toBeDefined();
    expect(hash).not.toBe("my-secret-123");
  });

  it("should return true for matching password", async () => {
    const hash = await service.hash("correct-password");
    const result = await service.compare("correct-password", hash);
    expect(result).toBe(true);
  });

  it("should return false for wrong password", async () => {
    const hash = await service.hash("correct-password");
    const result = await service.compare("wrong-password", hash);
    expect(result).toBe(false);
  });

  it("should generate different hashes for same password", async () => {
    const hash1 = await service.hash("same-password");
    const hash2 = await service.hash("same-password");
    expect(hash1).not.toBe(hash2);
  });
});
