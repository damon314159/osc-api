import type { Context } from "./types.js";
import type { DTOUser } from "../types/common.js";
import type { IncomingMessage } from "node:http";
import { services } from "../services/index.js";

/**
 * Creates a GraphQL context object for each incoming request.
 *
 * @param {Object} params - The parameters object.
 * @param {IncomingMessage} params.req - The Node.js HTTP incoming message object.
 * @returns {Promise<Context>} A promise that resolves to the GraphQL context object.
 *
 * @description
 * This function:
 * 1. Extracts the Bearer token from the Authorization header.
 * 2. Validates the token and retrieves the associated user.
 * 3. Creates a context object containing the user (if authenticated) and the services object.
 */
export async function createContext({
  req,
}: {
  req: IncomingMessage;
}): Promise<Context> {
  const token = req.headers.authorization?.replace("Bearer ", "");

  let user: DTOUser | undefined;
  if (token) {
    try {
      user = await services.user.validateToken(token);
    } catch (error) {
      // TODO: Implement a proper logging and monitoring strategy
      console.error(
        `Invalid token: ${error instanceof Error ? error.message : "Unknown error type"}`,
      );
    }
  }

  return {
    user,
    services,
  };
}
