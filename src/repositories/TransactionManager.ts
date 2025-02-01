import type { ITransactionManager } from "./types.js";
import type { Database, DatabaseContext, Transaction } from "../db/types.js";

/**
 * The TransactionManager class is responsible for managing database transactions
 * in the application. Transactions are essential for atomicity of database operations
 * and help maintain data integrity in multistep processes that may fail partway through.
 */
export class TransactionManager implements ITransactionManager {
  constructor(private readonly db: Database) {}

  /**
   * Starts a new database transaction and executes the provided callback function
   * within the context of that transaction.
   *
   * @param callback - A function that will be executed within the transaction context.
   * @param parent - An optional parent transaction to use as the context for this transaction.
   * Drizzle supports nested transactions as "save-points" which can be rolled back independently of their parents.
   * https://orm.drizzle.team/docs/transactions
   * @returns The result of the callback function, wrapped in a Promise.
   */
  startTransaction = <T>(
    callback: (tx: Transaction) => Promise<T>,
    parent?: Transaction,
  ): Promise<T> => {
    const invoker: DatabaseContext = parent ?? this.db;
    return invoker.transaction(callback);
  };
}
