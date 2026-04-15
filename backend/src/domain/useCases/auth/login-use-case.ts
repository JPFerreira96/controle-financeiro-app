import type { IUserRepository } from "../../repositories/user-repository.js";
import type { AuthResultDTO } from "../../../application/dtos/auth-dtos.js";
import { PasswordService } from "../../../application/services/password-service.js";
import { AppError } from "../../../shared/errors/app-error.js";

interface LoginInput {
  email: string;
  password: string;
}

type SignToken = (payload: { sub: string; email: string; name: string }) => string;

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: PasswordService,
    private readonly signToken: SignToken,
  ) {}

  async execute(input: LoginInput): Promise<AuthResultDTO> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError("Credenciais invalidas.", 401);
    }

    const passwordMatches = await this.passwordService.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError("Credenciais invalidas.", 401);
    }

    const token = this.signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    };
  }
}

