import type { User } from "../entities/user.js";

export interface CreateUserParams {
  name: string;
  email: string;
  passwordHash: string;
}

export interface IUserRepository {
  create(params: CreateUserParams): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}

