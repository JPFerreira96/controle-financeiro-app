import type { UserWithoutPassword } from "../../domain/entities/user.js";

export interface AuthResultDTO {
  user: UserWithoutPassword;
  token: string;
}

