import type { Transaction } from "../../src/db/types.js";
import { vi } from "vitest";

export const mockNestedTx = {
  select: vi.fn(() => mockNestedTx as unknown),
  from: vi.fn(() => mockNestedTx as unknown),
  where: vi.fn(() => mockNestedTx as unknown),
  insert: vi.fn(() => mockNestedTx as unknown),
  update: vi.fn(() => mockNestedTx as unknown),
  delete: vi.fn(() => mockNestedTx as unknown),
  set: vi.fn(() => mockNestedTx as unknown),
  values: vi.fn(() => mockNestedTx as unknown),
  returning: vi.fn(() => mockNestedTx as unknown),
  orderBy: vi.fn(() => mockNestedTx as unknown),
  limit: vi.fn(() => mockNestedTx as unknown),
  $dynamic: vi.fn(() => mockNestedTx as unknown),
};

export const mockTx = {
  select: vi.fn(() => mockTx as unknown),
  from: vi.fn(() => mockTx as unknown),
  where: vi.fn(() => mockTx as unknown),
  insert: vi.fn(() => mockTx as unknown),
  update: vi.fn(() => mockTx as unknown),
  delete: vi.fn(() => mockTx as unknown),
  set: vi.fn(() => mockTx as unknown),
  values: vi.fn(() => mockTx as unknown),
  returning: vi.fn(() => mockTx as unknown),
  orderBy: vi.fn(() => mockTx as unknown),
  limit: vi.fn(() => mockTx as unknown),
  $dynamic: vi.fn(() => mockTx as unknown),

  transaction: vi.fn((cb: (tx: Transaction) => unknown) =>
    cb(mockNestedTx as unknown as Transaction),
  ),
};

export const mockDb = {
  select: vi.fn(() => mockDb as unknown),
  from: vi.fn(() => mockDb as unknown),
  where: vi.fn(() => mockDb as unknown),
  insert: vi.fn(() => mockDb as unknown),
  update: vi.fn(() => mockDb as unknown),
  delete: vi.fn(() => mockDb as unknown),
  set: vi.fn(() => mockDb as unknown),
  values: vi.fn(() => mockDb as unknown),
  returning: vi.fn(() => mockDb as unknown),
  orderBy: vi.fn(() => mockDb as unknown),
  limit: vi.fn(() => mockDb as unknown),
  $dynamic: vi.fn(() => mockDb as unknown),

  transaction: vi.fn((cb: (tx: Transaction) => unknown) =>
    cb(mockTx as unknown as Transaction),
  ),
};
