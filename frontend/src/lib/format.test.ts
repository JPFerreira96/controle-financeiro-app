import { describe, it, expect } from "vitest";
import { toCurrency, formatDate } from "./format";

describe("format utils", () => {
  describe("toCurrency", () => {
    it("should format number as BRL currency", () => {
      const result = toCurrency(1500.5);
      // Intl may use non-breaking space (U+00A0)
      expect(result).toMatch(/R\$\s*1\.500,50/);
    });

    it("should format zero", () => {
      const result = toCurrency(0);
      expect(result).toMatch(/R\$\s*0,00/);
    });

    it("should format negative value", () => {
      const result = toCurrency(-250.99);
      expect(result).toMatch(/-?\s*R\$\s*250,99/);
    });
  });

  describe("formatDate", () => {
    it("should format ISO date string to pt-BR format", () => {
      const result = formatDate("2025-06-15T12:00:00.000Z");
      expect(result).toBe("15/06/2025");
    });

    it("should format another date correctly", () => {
      const result = formatDate("2026-01-01T12:00:00.000Z");
      expect(result).toBe("01/01/2026");
    });
  });
});
