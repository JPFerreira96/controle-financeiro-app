import { describe, it, expect, beforeEach } from "vitest";
import { getToken, saveAuthSession, clearAuthSession, getAuthenticatedUser } from "./auth-storage";

describe("auth-storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getToken", () => {
    it("should return null when no token is stored", () => {
      expect(getToken()).toBeNull();
    });

    it("should return stored token", () => {
      localStorage.setItem("finance_app_token", "my-token");
      expect(getToken()).toBe("my-token");
    });
  });

  describe("saveAuthSession", () => {
    it("should save token and user to localStorage", () => {
      const user = { id: "1", name: "Julio", email: "julio@test.com" };
      saveAuthSession("jwt-token-123", user);

      expect(localStorage.getItem("finance_app_token")).toBe("jwt-token-123");
      expect(JSON.parse(localStorage.getItem("finance_app_user")!)).toEqual(user);
    });
  });

  describe("clearAuthSession", () => {
    it("should remove token and user from localStorage", () => {
      localStorage.setItem("finance_app_token", "token");
      localStorage.setItem("finance_app_user", '{"id":"1"}');

      clearAuthSession();

      expect(localStorage.getItem("finance_app_token")).toBeNull();
      expect(localStorage.getItem("finance_app_user")).toBeNull();
    });
  });

  describe("getAuthenticatedUser", () => {
    it("should return null when no user is stored", () => {
      expect(getAuthenticatedUser()).toBeNull();
    });

    it("should return parsed user object", () => {
      const user = { id: "1", name: "Julio", email: "julio@test.com" };
      localStorage.setItem("finance_app_user", JSON.stringify(user));

      expect(getAuthenticatedUser()).toEqual(user);
    });

    it("should return null if stored value is invalid JSON", () => {
      localStorage.setItem("finance_app_user", "not-json");
      expect(getAuthenticatedUser()).toBeNull();
    });
  });
});
