import { describe, it, expect } from "vitest";
import { toCents, fromCents, roundCurrency } from "./money.js";

describe("money utils", () => {
  describe("toCents", () => {
    it("should convert reais to cents", () => {
      expect(toCents(10)).toBe(1000);
      expect(toCents(0.01)).toBe(1);
      expect(toCents(99.99)).toBe(9999);
    });

    it("should round to avoid floating point issues", () => {
      expect(toCents(19.99)).toBe(1999);
      expect(toCents(0.1 + 0.2)).toBe(30);
    });

    it("should handle zero", () => {
      expect(toCents(0)).toBe(0);
    });
  });

  describe("fromCents", () => {
    it("should convert cents to reais", () => {
      expect(fromCents(1000)).toBe(10);
      expect(fromCents(1)).toBe(0.01);
      expect(fromCents(9999)).toBe(99.99);
    });

    it("should handle zero", () => {
      expect(fromCents(0)).toBe(0);
    });
  });

  describe("roundCurrency", () => {
    it("should round to 2 decimal places", () => {
      expect(roundCurrency(10.126)).toBe(10.13);
      expect(roundCurrency(10.124)).toBe(10.12);
      expect(roundCurrency(10)).toBe(10);
    });
  });
});
