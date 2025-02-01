/* eslint-disable @typescript-eslint/no-use-before-define */
import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

// Models:

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["ADMIN", "USER"] })
    .notNull()
    .default("USER"),
});

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().unique(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(),
  outcome: text("outcome").notNull(),
  collectionId: integer("collection_id").references(() => collections.id),
});

// Relations:

export const collectionsRelations = relations(collections, ({ many }) => ({
  courses: many(courses),
}));

export const coursesRelations = relations(courses, ({ one }) => ({
  collection: one(collections, {
    fields: [courses.collectionId],
    references: [collections.id],
  }),
}));
