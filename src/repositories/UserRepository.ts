import type { IUserRepository } from "./types.js";
import type {
  Database,
  DatabaseContext,
  NewUser,
  Transaction,
  User,
} from "../db/types.js";
import { asc, desc, eq } from "drizzle-orm";
import { users } from "../db/schema.js";
import { SortOrder } from "../types/common.js";

/**
 * The UserRepository class is responsible for managing the CRUD operations
 * for the User entity in the application's database.
 * It provides a consistent interface for interacting with the injected database,
 * abstracting away the underlying implementation details.
 */
export class UserRepository implements IUserRepository {
  constructor(private readonly db: Database) {}

  /**
   * Retrieves a single user from the database by its id.
   *
   * @param id - The unique identifier of the user to be fetched.
   * @param tx - An optional database transaction to use for the operation.
   * @returns The fetched user, or null if not found.
   */
  async findById(id: number, tx?: Transaction): Promise<User | null> {
    const client: DatabaseContext = tx || this.db;
    const result = await client
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Retrieves all users from the database.
   *
   * @param limit - An optional limit to constrain how many records will be returned.
   * @param sortOrder - An optional ordering to be used to sort the returned records.
   * @param tx - An optional database transaction to use for the operation.
   * @returns An array of all users in the database.
   */
  findAll(
    limit?: number | null,
    sortOrder?: SortOrder | null,
    tx?: Transaction,
  ): Promise<User[]> {
    const client: DatabaseContext = tx || this.db;
    let query = client.select().from(users).$dynamic();

    if (sortOrder) {
      const ascOrDesc = sortOrder === SortOrder.ASC ? asc : desc;
      query = query.orderBy(ascOrDesc(users.id));
    }
    if (limit) {
      query = query.limit(limit);
    }

    return query;
  }

  /**
   * Retrieves a single user from the database by its username.
   *
   * @param username - The unique username of the user to be fetched.
   * @param tx - An optional database transaction to use for the operation.
   * @returns The fetched user, or null if not found.
   */
  async findByUsername(
    username: string,
    tx?: Transaction,
  ): Promise<User | null> {
    const client: DatabaseContext = tx || this.db;
    const result = await client
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Creates a new user in the database.
   *
   * @param user - The new user data to be used in creating the record.
   * @param tx - An optional database transaction to use for the operation.
   * @returns The newly created user.
   */
  async create(user: NewUser, tx?: Transaction): Promise<User> {
    const client: DatabaseContext = tx || this.db;
    const result = await client.insert(users).values(user).returning();

    return result[0];
  }

  /**
   * Updates an existing user in the database.
   *
   * @param id - The unique identifier of the user to be updated.
   * @param user - The updated user data to write into the matched record.
   * @param tx - An optional database transaction to use for the operation.
   * @returns The updated user, or null if the record was not found.
   */
  async update(
    id: number,
    user: Partial<NewUser>,
    tx?: Transaction,
  ): Promise<User | null> {
    const client: DatabaseContext = tx || this.db;
    const result = await client
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning();

    return result[0] || null;
  }

  /**
   * Deletes an existing user from the database.
   *
   * @param id - The unique identifier of the user to be deleted.
   * @param tx - An optional database transaction to use for the operation.
   */
  async delete(id: number, tx?: Transaction): Promise<void> {
    const client: DatabaseContext = tx || this.db;
    await client.delete(users).where(eq(users.id, id));
  }
}
