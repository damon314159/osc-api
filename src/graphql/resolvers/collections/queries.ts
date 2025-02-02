import type { ICollectionQueries } from "./types.js";
import { GraphQLError } from "graphql";

export const CollectionQueries: ICollectionQueries = {
  Query: {
    /**
     * Retrieves a list of all collections.
     *
     * @returns {Promise<Collection[]>} The list of collections.
     */
    collections(_, __, context) {
      return context.services.collection.getCollections();
    },

    /**
     * Retrieves a single collection by its ID.
     *
     * @returns {Promise<Collection>} The collection.
     * @throws {GraphQLError} If the collection is not found.
     */
    async collection(_, args, context) {
      const result = await context.services.collection.getCollection(args.id);
      if (!result) {
        throw new GraphQLError("Collection not found", {
          extensions: {
            code: "NOT_FOUND",
            http: { status: 404 },
          },
        });
      }
      return result;
    },
  },

  Collection: {
    /**
     * Retrieves a list of all courses associated with a parent collection.
     *
     * @returns {Promise<Course[]>} The list of associated courses.
     */
    courses(parent, _, context) {
      return context.services.course.getCoursesByCollection(parent.id);
    },
  },
};
