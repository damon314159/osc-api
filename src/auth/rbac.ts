import type { User } from "../db/types.js";
import type { Context } from "../graphql/types.js";
import { GraphQLError } from "graphql";

/**
 * Verifies if a user is authenticated.
 *
 * @param {Context} context - The GraphQL context object containing user information.
 * @throws {GraphQLError} Throws a GraphQL error with 401 status if user is not authenticated.
 */
export const isAuthenticated = (context: Context) => {
  const { user } = context;
  if (!user) {
    throw new GraphQLError("Not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
};

/**
 * Creates a function that checks if the authenticated user has one of the allowed roles.
 *
 * @param {User["role"][]} roles - Array of roles that are allowed to access the resource.
 * @returns {Function} A function that takes a context parameter and tests the user's credentials against the roles.
 * @throws {GraphQLError} Throws a GraphQL error with:
 *   - 401 status if user is not authenticated.
 *   - 403 status if user's role is not in the allowed roles list.
 */
export const allowRoles = (roles: User["role"][]) => (context: Context) => {
  const { user } = context;
  if (!user) {
    throw new GraphQLError("Not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  const userRole = user.role;
  if (!roles.includes(userRole)) {
    throw new GraphQLError("Not authorized", {
      extensions: {
        code: "UNAUTHORIZED",
        http: { status: 403 },
      },
    });
  }
};
