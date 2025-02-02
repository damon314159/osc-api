import type {
  Collection,
  Course,
  Transaction,
  User,
} from "../../src/db/types.js";
import { vi } from "vitest";
import { mockCollection, mockCourse, mockUser } from "./entities.mock.js";

export const mockUserRepository = {
  findById: vi.fn(async () => mockUser as User | null),
  findAll: vi.fn(async () => [mockUser]),
  findByUsername: vi.fn(async () => mockUser as User | null),
  create: vi.fn(async () => mockUser),
  update: vi.fn(async () => mockUser as User | null),
  delete: vi.fn(async () => {}),
};

export const mockCourseRepository = {
  findById: vi.fn(async () => mockCourse as Course | null),
  findAll: vi.fn(async () => [mockCourse]),
  findByCollection: vi.fn(async () => [mockCourse]),
  create: vi.fn(async () => mockCourse),
  update: vi.fn(async () => mockCourse as Course | null),
  delete: vi.fn(async () => {}),
};

export const mockCollectionRepository = {
  findById: vi.fn(async () => mockCollection as Collection | null),
  findAll: vi.fn(async () => [mockCollection]),
  create: vi.fn(async () => mockCollection),
  update: vi.fn(async () => mockCollection as Collection | null),
  delete: vi.fn(async () => {}),
};

export const mockRepositories = {
  user: mockUserRepository,
  course: mockCourseRepository,
  collection: mockCollectionRepository,
  startTransaction: vi.fn((cb: (tx: Transaction) => unknown) =>
    cb({} as Transaction),
  ),
};
