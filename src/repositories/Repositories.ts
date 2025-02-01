import type { IRepositories } from "./types.js";
import type { Database } from "../db/types.js";
import { CollectionRepository } from "./CollectionRepository.js";
import { CourseRepository } from "./CourseRepository.js";
import { TransactionManager } from "./TransactionManager.js";
import { UserRepository } from "./UserRepository.js";

/**
 * The repository layer acts as the central entry point for interacting with the database.
 * By injecting the database instance only at this sole point, we ensure that there is a total
 * separation of concerns between the layers, with an ergonomic abstraction.
 */
export class Repositories implements IRepositories {
  readonly startTransaction;
  readonly user;
  readonly course;
  readonly collection;

  constructor(db: Database) {
    this.startTransaction = new TransactionManager(db).startTransaction;
    this.user = new UserRepository(db);
    this.course = new CourseRepository(db);
    this.collection = new CollectionRepository(db);
  }
}
