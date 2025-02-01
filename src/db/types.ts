import type { collections, courses, users } from "./schema.js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

// Database
export type Database = PostgresJsDatabase;
export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
export type DatabaseContext = Database | Transaction;

// Models
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
