import type { ICollectionRepository } from "./types.js";
import type {
  Collection,
  Database,
  DatabaseContext,
  NewCollection,
  Transaction,
} from "../db/types.js";
import { asc, desc, eq } from "drizzle-orm";
import { collections } from "../db/schema.js";
import { SortOrder } from "../types/common.js";

/**
 * The CollectionRepository class is responsible for managing the CRUD operations
 * for the Collection entity in the application's database.
 * It provides a consistent interface for interacting with the injected database,
 * abstracting away the underlying implementation details.
 */
export class CollectionRepository implements ICollectionRepository {
  constructor(private readonly db: Database) {}

  /**
   * Retrieves a single collection from the database by its id.
   *
   * @param id - The unique identifier of the collection to be fetched.
   * @param tx - An optional database transaction to use for the operation.
   * @returns The fetched collection, or null if not found.
   */
  async findById(id: number, tx?: Transaction): Promise<Collection | null> {
    const client: DatabaseContext = tx || this.db;
    const result = await client
      .select()
      .from(collections)
      .where(eq(collections.id, id))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Retrieves all collections from the database.
   *
   * @param limit - An optional limit to constrain how many records will be returned.
   * @param sortOrder - An optional ordering to be used to sort the returned records.
   * @param tx - An optional database transaction to use for the operation.
   * @returns An array of all collections in the database.
   */
  findAll(
    limit?: number | null,
    sortOrder?: SortOrder | null,
    tx?: Transaction,
  ): Promise<Collection[]> {
    const client: DatabaseContext = tx || this.db;
    let query = client.select().from(collections).$dynamic();

    if (sortOrder) {
      const ascOrDesc = sortOrder === SortOrder.ASC ? asc : desc;
      query = query.orderBy(ascOrDesc(collections.id));
    }
    if (limit) {
      query = query.limit(limit);
    }

    return query;
  }

  /**
   * Creates a new collection in the database.
   *
   * @param collection - The new collection data to be used in creating the record.
   * @param tx - An optional database transaction to use for the operation.
   * @returns The newly created collection.
   */
  async create(
    collection: NewCollection,
    tx?: Transaction,
  ): Promise<Collection> {
    const client: DatabaseContext = tx || this.db;
    const result = await client
      .insert(collections)
      .values(collection)
      .returning();

    return result[0];
  }

  /**
   * Updates an existing collection in the database.
   *
   * @param id - The unique identifier of the collection to be updated.
   * @param collection - The updated collection data to write into the matched record.
   * @param tx - An optional database transaction to use for the operation.
   * @returns The updated collection, or null if the record was not found.
   */
  async update(
    id: number,
    collection: Partial<NewCollection>,
    tx?: Transaction,
  ): Promise<Collection | null> {
    const client: DatabaseContext = tx || this.db;
    const result = await client
      .update(collections)
      .set(collection)
      .where(eq(collections.id, id))
      .returning();

    return result[0] || null;
  }

  /**
   * Deletes an existing collection from the database.
   *
   * @param id - The unique identifier of the collection to be deleted.
   * @param tx - An optional database transaction to use for the operation.
   */
  async delete(id: number, tx?: Transaction): Promise<void> {
    const client: DatabaseContext = tx || this.db;
    await client.delete(collections).where(eq(collections.id, id));
  }
}
