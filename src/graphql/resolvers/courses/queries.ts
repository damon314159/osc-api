import type { ICourseQueries } from "./types.js";
import { GraphQLError } from "graphql";

export const CourseQueries: ICourseQueries = {
  Query: {
    /**
     * Retrieves a list of all courses.
     *
     * @returns {Promise<Course[]>} The list of courses.
     */
    courses(_, args, context) {
      return context.services.course.getCourses(args.limit, args.sortOrder);
    },

    /**
     * Retrieves a single course by its ID.
     *
     * @returns {Promise<Course>} The course.
     * @throws {GraphQLError} If the course is not found.
     */
    async course(_, args, context) {
      const result = await context.services.course.getCourse(args.id);
      if (!result) {
        throw new GraphQLError("Course not found", {
          extensions: {
            code: "NOT_FOUND",
            http: { status: 404 },
          },
        });
      }
      return result;
    },
  },

  Course: {
    /**
     * Retrieves the collection that a parent course belongs to.
     *
     * @returns {Promise<Collection | null>} The associated collection, or null if not found.
     */
    collection(parent, _, context) {
      if (!parent.collectionId) {
        return Promise.resolve(null);
      }
      return context.services.collection.getCollection(parent.collectionId);
    },
  },
};
