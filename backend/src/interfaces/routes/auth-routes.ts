import type { FastifyInstance } from "fastify";

import { AuthController } from "../controllers/auth-controller.js";

export const registerAuthRoutes = (app: FastifyInstance, authController: AuthController): void => {
  app.post("/api/auth/register", authController.register);
  app.post("/api/auth/login", authController.login);

  // aliases para manter a semantica "criar usuario"
  app.post("/api/users/register", authController.register);
  app.post("/api/users/login", authController.login);
};

