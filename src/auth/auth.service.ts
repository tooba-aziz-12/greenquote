import bcrypt from "bcryptjs";
import { UserRepository } from "./user.repository";

export class AuthService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async register(fullName: string, email: string, password: string) {
    console.info("User registration requested", {
      email,
    });

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      console.warn("Registration rejected: email already exists", {
        email,
      });

      throw new Error("Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      fullName,
      email,
      passwordHash,
    });

    console.info("User registered successfully", {
      userId: user.id,
      email: user.email,
    });

    return user;
  }

  async login(email: string, password: string) {
    console.info("Login requested", {
      email,
    });

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      console.warn("Login failed: user not found", {
        email,
      });

      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      console.warn("Login failed: invalid password", {
        email,
        userId: user.id,
      });

      return null;
    }

    console.info("Login successful", {
      userId: user.id,
      email: user.email,
    });

    return user;
  }
}