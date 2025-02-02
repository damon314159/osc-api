import type { User } from "../db/types.js";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";

/**
 * Hashes a plaintext password using the Argon2 algorithm.
 *
 * @param password - The plaintext password to be hashed.
 * @returns The hashed password.
 */
export const hashPassword = (password: string) => hash(password);

/**
 * Compares a plaintext password with a hashed password using the Argon2 algorithm.
 *
 * @param plainPassword - The plaintext password to be compared.
 * @param hashedPassword - The hashed password to be compared against.
 * @returns True if the passwords match, false otherwise.
 */
export const comparePassword = (
  plainPassword: string,
  hashedPassword: string,
) => verify(hashedPassword, plainPassword);

/**
 * Generates a JWT token for a given user.
 *
 * @param user - The user for whom the token should be generated.
 * @param secret - The secret key used to sign the JWT token.
 * @returns The generated JWT token.
 */
export const generateToken = (user: User, secret: string) => {
  if (!secret) {
    throw new Error("generateToken requires a secret to sign the JWT");
  }
  // Only store non-sensitive fields in the JWT. ID is sensitive as it gives away information about the size of userbase.
  return jwt.sign({ username: user.username }, secret, {
    expiresIn: "24h",
  });
};

export type JwtPayload = { username: string };

/**
 * Verifies a JWT token and retrieves the decoded payload.
 *
 * @param token - The JWT token to be verified.
 * @param secret - The secret key used to sign the JWT token.
 * @returns The decoded JWT payload.
 */
export const verifyToken = (token: string, secret: string) => {
  if (!secret) {
    return Promise.reject(
      new Error("verifyToken requires a secret to validate the JWT"),
    );
  }
  // Wrap in a Promise for convenient handling of the verify function's throw on validation failure
  return new Promise<JwtPayload>((resolve, reject) => {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        reject(new Error("Invalid token"));
        return;
      }
      resolve(decoded as JwtPayload);
    });
  });
};
