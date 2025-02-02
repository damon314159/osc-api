import type { User } from "../db/types.js";
import type { DTOUser } from "../types/common.js";

/**
 * Convert a user object to a data transfer object with sensitive fields stripped out.
 * Exposing id gives away system info regarding user count, and password hashes should not be leaked.
 *
 * @param user - The user object from the data layer.
 * @returns The DTOUser object to be passed from the service layer to the resolver layer.
 */
export const getUserDto = (user: User): DTOUser => {
  const { id, password, ...rest } = user;
  return rest;
};
