import type { IUserQueries } from "./types.js";
import type { DTOUser } from "../../../types/common.js";
import { isAuthenticated } from "../../../auth/rbac.js";

export const UserQueries: IUserQueries = {
  Query: {
    /**
     * Retrieves the currently authenticated user's data.
     *
     * @returns {Promise<DTOUser>} The currently authenticated user's data.
     * @throws {Error} If the user is not authenticated.
     */
    async me(_, __, context) {
      isAuthenticated(context);
      return context.user as DTOUser;
    },
  },
};
