import type { ICourseRepository } from "./types.js";
import type {
  Course,
  Database,
  DatabaseContext,
  NewCourse,
  Transaction,
} from "../db/types.js";
import { asc, desc, eq } from "drizzle-orm";
import { courses } from "../db/schema.js";
import { SortOrder } from "../types/common.js";

/**
 * The CourseRepository class is responsible for managing the CRUD operations
 * for the Course entity in the application's database.
 * It provides a consistent interface for interacting with the injected database,
 * abstracting away the underlying implementation details.
 */
export class CourseRepository implements ICourseRepository {
  constructor(private readonly db: Database) {}

  /**
   * Retrieves a single course from the database by its id.
   *
   * @param id - The unique identifier of the course to be fetched.
   * @param tx - An optional database transaction to use for the operation.
   * @returns The fetched course, or null if not found.
   */
  async findById(id: number, tx?: Transaction): Promise<Course | null> {
    const client: DatabaseContext = tx || this.db;
    const result = await client
      .select()
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Retrieves all courses from the database.
   *
   * @param limit - An optional limit to constrain how many records will be returned.
   * @param sortOrder - An optional ordering to be used to sort the returned records.
   * @param tx - An optional database transaction to use for the operation.
   * @returns An array of all courses in the database.
   */
  findAll(
    limit?: number | null,
    sortOrder?: SortOrder | null,
    tx?: Transaction,
  ): Promise<Course[]> {
    const client: DatabaseContext = tx || this.db;
    let query = client.select().from(courses).$dynamic();

    if (sortOrder) {
      const ascOrDesc = sortOrder === SortOrder.ASC ? asc : desc;
      query = query.orderBy(ascOrDesc(courses.id));
    }
    if (limit) {
      query = query.limit(limit);
    }

    return query;
  }

  /**
   * Retrieves all courses from the database matching a given collection ID.
   *
   * @param collectionId - An optional limit to constrain how many records will be returned.
   * @param tx - An optional database transaction to use for the operation.
   * @returns An array of all courses in the database matching the collection.
   */
  findByCollection(collectionId: number, tx?: Transaction): Promise<Course[]> {
    const client: DatabaseContext = tx || this.db;
    return client
      .select()
      .from(courses)
      .where(eq(courses.collectionId, collectionId));
  }

  /**
   * Creates a new course in the database.
   *
   * @param course - The new course data to be used in creating the record.
   * @param tx - An optional database transaction to use for the operation.
   * @returns The newly created course.
   */
  async create(course: NewCourse, tx?: Transaction): Promise<Course> {
    const client: DatabaseContext = tx || this.db;
    const result = await client.insert(courses).values(course).returning();

    return result[0];
  }

  /**
   * Updates an existing course in the database.
   *
   * @param id - The unique identifier of the course to be updated.
   * @param course - The updated course data to write into the matched record.
   * @param tx - An optional database transaction to use for the operation.
   * @returns The updated course, or null if the record was not found.
   */
  async update(
    id: number,
    course: Partial<NewCourse>,
    tx?: Transaction,
  ): Promise<Course | null> {
    const client: DatabaseContext = tx || this.db;
    const result = await client
      .update(courses)
      .set(course)
      .where(eq(courses.id, id))
      .returning();

    return result[0] || null;
  }

  /**
   * Deletes an existing course from the database.
   *
   * @param id - The unique identifier of the course to be deleted.
   * @param tx - An optional database transaction to use for the operation.
   */
  async delete(id: number, tx?: Transaction): Promise<void> {
    const client: DatabaseContext = tx || this.db;
    await client.delete(courses).where(eq(courses.id, id));
  }
}
