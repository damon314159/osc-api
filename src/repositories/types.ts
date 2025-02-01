import type {
  Collection,
  Course,
  NewCollection,
  NewCourse,
  NewUser,
  Transaction,
  User,
} from "../db/types.js";
import type { SortOrder } from "../types/common.js";

export interface IRepository<T, TNew> {
  findById(id: number, tx?: Transaction): Promise<T | null>;
  findAll(
    limit?: number | null,
    sortOrder?: SortOrder | null,
    tx?: Transaction,
  ): Promise<T[]>;
  create(input: TNew, tx?: Transaction): Promise<T>;
  update(id: number, input: Partial<TNew>, tx?: Transaction): Promise<T | null>;
  delete(id: number, tx?: Transaction): Promise<void>;
}

export interface IUserRepository extends IRepository<User, NewUser> {
  findByUsername(username: string, tx?: Transaction): Promise<User | null>;
}
export interface ICourseRepository extends IRepository<Course, NewCourse> {
  findByCollection(collectionId: number, tx?: Transaction): Promise<Course[]>;
}
export type ICollectionRepository = IRepository<Collection, NewCollection>; // Type alias for now, until new methods are required beyond IRepository

export interface ITransactionManager {
  startTransaction<T>(
    callback: (tx: Transaction) => Promise<T>,
    parent?: Transaction,
  ): Promise<T>;
}

export interface IRepositories extends ITransactionManager {
  user: IUserRepository;
  course: ICourseRepository;
  collection: ICollectionRepository;
}
