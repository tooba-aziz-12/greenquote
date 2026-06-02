import bcrypt from "bcryptjs";
import { UserRepository } from "./user.repository";

export class AuthService {
  constructor(
    private readonly userRepository = new UserRepository()
  ) {}

  async register(
    fullName: string,
    email: string,
    password: string
  ) {
    const existingUser =
      await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    return this.userRepository.create({
      fullName,
      email,
      passwordHash,
    });
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return null;
    }

    return user;
  }
}