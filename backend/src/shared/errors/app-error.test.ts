import { describe, it, expect } from "vitest";
import { AppError } from "./app-error.js";

describe("AppError", () => {
  it("should create error with default status 400", () => {
    const error = new AppError("bad request");
    expect(error.message).toBe("bad request");
    expect(error.statusCode).toBe(400);
    expect(error).toBeInstanceOf(Error);
  });

  it("should create error with custom status code", () => {
    const error = new AppError("not found", 404);
    expect(error.statusCode).toBe(404);
  });

  it("should create error with 409 conflict", () => {
    const error = new AppError("conflict", 409);
    expect(error.statusCode).toBe(409);
  });
});
