import type { IUserRepository } from "../../repositories/user-repository.js";
import type { UserWithoutPassword } from "../../entities/user.js";
import { PasswordService } from "../../../application/services/password-service.js";
import { AppError } from "../../../shared/errors/app-error.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(input: RegisterInput): Promise<UserWithoutPassword> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError("Email ja cadastrado.", 409);
    }

    const passwordHash = await this.passwordService.hash(input.password);

    const createdUser = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    };
  }
}
