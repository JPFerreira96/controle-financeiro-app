import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should display the landing page with key elements", async ({ page }) => {
    await page.goto("/");

    // Title / branding
    await expect(page.getByText("Finance OS")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Controle financeiro pessoal/i }),
    ).toBeVisible();

    // CTA links
    await expect(page.getByRole("link", { name: /Entrar no sistema/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Ver dashboard/i })).toBeVisible();
  });

  test("should navigate to auth page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Entrar no sistema/i }).click();
    await expect(page).toHaveURL(/\/auth/);
  });

  test("should navigate to dashboard page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Ver dashboard/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
