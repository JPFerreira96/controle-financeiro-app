import { test, expect } from "@playwright/test";

test.describe("Auth Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth");
  });

  test("should display login form by default", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Acessar conta/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/senha/i)).toBeVisible();
  });

  test("should toggle to register mode", async ({ page }) => {
    await page.getByRole("button", { name: /Criar conta/i }).click();
    await expect(page.getByRole("heading", { name: /Criar conta/i })).toBeVisible();
    await expect(page.getByLabel(/nome/i)).toBeVisible();
  });

  test("should show error on invalid login", async ({ page }) => {
    await page.getByLabel(/email/i).fill("nonexistent@test.com");
    await page.getByLabel(/senha/i).fill("wrongpassword");
    await page.getByRole("button", { name: /entrar/i }).click();

    // Should show some error feedback
    await expect(page.getByText(/erro|invalido|falha/i)).toBeVisible({ timeout: 10_000 });
  });

  test("should register and login successfully", async ({ page }) => {
    // Switch to register
    await page.getByRole("button", { name: /Criar conta/i }).click();

    const uniqueEmail = `e2e-${Date.now()}@test.com`;

    await page.getByLabel(/nome/i).fill("E2E Test User");
    await page.getByLabel(/email/i).fill(uniqueEmail);
    await page.getByLabel(/senha/i).fill("password123");
    await page.getByRole("button", { name: /criar|cadastrar|registrar/i }).click();

    // Should redirect to dashboard after successful auth
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  });
});
