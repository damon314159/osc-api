import path from "node:path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { __dirname } from "../utils/meta.js";
import { CollectionQueries } from "./resolvers/collections/queries.js";
import { CourseMutations } from "./resolvers/courses/mutations.js";
import { CourseQueries } from "./resolvers/courses/queries.js";
import { UserMutations } from "./resolvers/users/mutations.js";
import { UserQueries } from "./resolvers/users/queries.js";

// Load all .graphql files from the schema directory and merge their typeDefs to be used in the server config.
const typesArray = loadFilesSync(
  path.join(__dirname(import.meta), "./schema"),
  { extensions: ["graphql"] },
);
const typeDefs = mergeTypeDefs(typesArray);

// Merge all resolvers from across the resources into a single set to be used in the server config
const resolvers = {
  Query: {
    ...UserQueries.Query,
    ...CourseQueries.Query,
    ...CollectionQueries.Query,
  },
  Mutation: {
    ...UserMutations.Mutation,
    ...CourseMutations.Mutation,
  },
  Course: CourseQueries.Course,
  Collection: CollectionQueries.Collection,
};

export { typeDefs, resolvers };
