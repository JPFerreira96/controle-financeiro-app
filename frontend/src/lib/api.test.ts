import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiRequest } from "./api";

describe("apiRequest", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should make a request to the correct URL", async () => {
    const mockResponse = { id: "1", name: "Test" };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await apiRequest("/api/test");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/test"),
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  it("should include Authorization header when token is provided", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await apiRequest("/api/test", { token: "my-jwt-token" });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer my-jwt-token",
        }),
      }),
    );
  });

  it("should throw error with message from response body", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: "Credenciais invalidas." }),
    });

    await expect(apiRequest("/api/auth/login")).rejects.toThrow("Credenciais invalidas.");
  });

  it("should throw generic error if response body has no message", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error("no body")),
    });

    await expect(apiRequest("/api/fail")).rejects.toThrow("Erro HTTP 500");
  });
});
