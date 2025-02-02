import "dotenv/config";
import type { Context } from "./graphql/types.js";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { createContext } from "./graphql/context.js";
import { resolvers, typeDefs } from "./graphql/schema.js";

// Start a new Apollo server with the typeDefs and resolvers from the graphql directory
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

// Bind the server to the port in the .env
const { url } = await startStandaloneServer(server, {
  listen: { port: Number(process.env.PORT!) },
  context: createContext,
});

// eslint-disable-next-line no-console
console.log(`Server ready at: ${url}`);
