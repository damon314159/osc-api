import type { IUserService } from "./types.js";
import type { IRepositories } from "../repositories/types.js";
import type { AuthResponse, DTOUser } from "../types/common.js";
import {
  comparePassword,
  generateToken,
  hashPassword,
  verifyToken,
} from "../utils/auth.js";
import { getUserDto } from "../utils/getUserDto.js";

/**
 * The UserService class handles the business logic related to user management.
 * It leverages the repositories to abstract away the database interactions.
 */
export class UserService implements IUserService {
  private readonly JWT_SECRET = process.env.JWT_SECRET ?? "";

  constructor(private readonly repos: IRepositories) {}

  /**
   * Registers a new user in the system.
   * @param username - The username for the new user.
   * @param password - The password for the new user.
   * @returns An object containing the generated JWT token and the user DTO.
   */
  async register(username: string, password: string): Promise<AuthResponse> {
    try {
      // Begin a transaction so that the user is only committed to the database if a token can be successfully issued.
      return await this.repos.startTransaction(async (tx) => {
        // Check if user already exists before attempting to create one
        const existingUser = await this.repos.user.findByUsername(username, tx);
        if (existingUser) {
          // Ensure the real reason is slightly obfuscated before passing to client
          throw new Error("Your details are too similar to an existing user");
        }

        const user = await this.repos.user.create(
          { username, password: await hashPassword(password) },
          tx,
        );

        const token = generateToken(user, this.JWT_SECRET);

        return {
          token,
          user: getUserDto(user),
        };
      });
    } catch (error) {
      // TODO: Implement a proper logging and monitoring strategy
      console.error(
        `Rolled back register user transaction: ${error instanceof Error ? error.message : "Unknown error type"}`,
      );
      throw error;
    }
  }

  /**
   * Authenticates a user and generates a JWT token.
   * @param username - The username of the user to authenticate.
   * @param password - The password of the user to authenticate.
   * @returns An object containing the generated JWT token and the user DTO.
   */
  async login(username: string, password: string): Promise<AuthResponse> {
    const user = await this.repos.user.findByUsername(username);
    if (!user) {
      // Obfuscate the real reason to prevent a malicious user knowing whether the username or password is the wrong field
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      // Obfuscate the real reason to prevent a malicious user knowing whether the username or password is the wrong field
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user, this.JWT_SECRET);

    return {
      token,
      user: getUserDto(user),
    };
  }

  /**
   * Validates a JWT token and retrieves the corresponding user.
   * @param token - The JWT token to be validated.
   * @returns The user DTO corresponding to the validated token.
   */
  async validateToken(token: string): Promise<DTOUser> {
    const decoded = await verifyToken(token, this.JWT_SECRET);

    const user = await this.repos.user.findByUsername(decoded.username);
    if (!user) {
      throw new Error("User not found");
    }

    return getUserDto(user);
  }
}
