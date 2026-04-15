import { test, expect } from "@playwright/test";

test.describe("Health Check", () => {
  test("backend API should respond with status ok", async ({ request }) => {
    const response = await request.get("http://localhost:3333/health");
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.service).toBe("controle-financeiro-api");
  });
});
