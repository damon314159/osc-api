import type { ICourseMutations } from "./types.js";
import { GraphQLError } from "graphql";
import { allowRoles } from "../../../auth/rbac.js";

export const CourseMutations: ICourseMutations = {
  Mutation: {
    /**
     * Adds a new course.
     *
     * @returns {Promise<Course>} The newly created course.
     * @throws {GraphQLError} If unauthorized or the course creation fails.
     */
    async addCourse(_, args, context) {
      allowRoles(["USER", "ADMIN"])(context);

      try {
        return await context.services.course.addCourse(args.input);
      } catch {
        throw new GraphQLError("Failed to create course", {
          extensions: {
            code: "BAD_REQUEST",
            http: { status: 400 },
          },
        });
      }
    },

    /**
     * Updates an existing course.
     *
     * @returns {Promise<Course>} The updated course.
     * @throws {GraphQLError} If unauthorized or the course is not found.
     */
    async updateCourse(_, args, context) {
      allowRoles(["USER", "ADMIN"])(context);

      const updated = await context.services.course.updateCourse(
        args.id,
        args.input,
      );
      if (!updated) {
        throw new GraphQLError("Course not found", {
          extensions: {
            code: "NOT_FOUND",
            http: { status: 404 },
          },
        });
      }
      return updated;
    },

    /**
     * Deletes an existing course.
     *
     * @returns {Promise<boolean>} True if the course was successfully deleted.
     * @throws {GraphQLError} If unauthorized or the course is not found.
     */
    async deleteCourse(_, args, context) {
      allowRoles(["ADMIN"])(context);

      try {
        await context.services.course.deleteCourse(args.id);
        return true;
      } catch {
        throw new GraphQLError("Course not found", {
          extensions: {
            code: "NOT_FOUND",
            http: { status: 404 },
          },
        });
      }
    },
  },
};
