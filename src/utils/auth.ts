import { hash } from "argon2";

/**
 * Hashes a plaintext password using the Argon2 algorithm.
 *
 * @param password - The plaintext password to be hashed.
 * @returns The hashed password.
 */
export const hashPassword = (password: string) => hash(password);
