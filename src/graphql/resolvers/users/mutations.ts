import type { IUserMutations } from "./types.js";
import { GraphQLError } from "graphql";

export const UserMutations: IUserMutations = {
  Mutation: {
    /**
     * Registers a new user.
     *
     * @returns {Promise<AuthResponse>} The registered user and authentication token.
     * @throws {GraphQLError} If the user is already logged in or the registration fails.
     */
    async register(_, args, context) {
      if (context.user) {
        throw new GraphQLError("Already logged in", {
          extensions: {
            code: "BAD_REQUEST",
            http: { status: 400 },
          },
        });
      }

      try {
        const { user, token } = await context.services.user.register(
          args.username,
          args.password,
        );
        return { user, token };
      } catch {
        throw new GraphQLError("Registration failed", {
          extensions: {
            code: "BAD_REQUEST",
            http: { status: 400 },
          },
        });
      }
    },

    /**
     * Logs in an existing user.
     *
     * @returns {Promise<AuthResponse>} The authenticated user and token.
     * @throws {GraphQLError} If the user is already logged in or if the credentials are invalid.
     */
    async login(_, args, context) {
      if (context.user) {
        throw new GraphQLError("Already logged in", {
          extensions: {
            code: "BAD_REQUEST",
            http: { status: 400 },
          },
        });
      }

      try {
        const { user, token } = await context.services.user.login(
          args.username,
          args.password,
        );
        return { user, token };
      } catch {
        throw new GraphQLError("Invalid credentials", {
          extensions: {
            code: "UNAUTHORIZED",
            http: { status: 401 },
          },
        });
      }
    },
  },
};
