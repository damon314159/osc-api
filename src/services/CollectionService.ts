import type { ICollectionService } from "./types.js";
import type { Collection } from "../db/types.js";
import type { IRepositories } from "../repositories/types.js";

/**
 * The CollectionService class handles the business logic related to collection management.
 * It leverages the repositories to abstract away the database interactions.
 */
export class CollectionService implements ICollectionService {
  constructor(private readonly repos: IRepositories) {}

  /**
   * Retrieves a list of all collections.
   *
   * @returns A list of all matched collections.
   */
  async getCollections(): Promise<Collection[]> {
    return this.repos.collection.findAll();
  }

  /**
   * Retrieves a specific collection by its ID.
   *
   * @param id - The unique identifier of the collection.
   * @returns The matched collection, or null if nothing was matched.
   */
  async getCollection(id: number): Promise<Collection | null> {
    return this.repos.collection.findById(id);
  }
}
