import type { Database, Transaction } from "../../src/db/types.js";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { TransactionManager } from "../../src/repositories/TransactionManager.js";
import { mockDb, mockNestedTx, mockTx } from "../mocks/database.mock.js";

describe("TransactionManager", () => {
  const manager = new TransactionManager(mockDb as unknown as Database);

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("startTransaction", () => {
    it("executes callback within transaction context", async () => {
      const mockCallback = vi.fn().mockResolvedValueOnce("result");

      const result = await manager.startTransaction(mockCallback);

      expect(result).toBe("result");
      expect(mockDb.transaction).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(mockTx);
    });

    it("uses parent transaction when provided", async () => {
      const mockCallback = vi.fn().mockResolvedValueOnce("nested result");

      const result = await manager.startTransaction(
        mockCallback,
        mockTx as unknown as Transaction,
      );

      expect(result).toBe("nested result");
      expect(mockTx.transaction).toHaveBeenCalled();
      expect(mockDb.transaction).not.toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(mockNestedTx);
    });

    it("propagates errors from callback", async () => {
      const error = new Error("Transaction failed");
      const mockCallback = vi.fn().mockRejectedValueOnce(error);

      await expect(manager.startTransaction(mockCallback)).rejects.toThrow(
        error,
      );
      expect(mockDb.transaction).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(mockTx);
    });

    it("propagates errors from nested transactions", async () => {
      const error = new Error("Nested transaction failed");
      const mockCallback = vi.fn().mockRejectedValueOnce(error);

      await expect(
        manager.startTransaction(
          mockCallback,
          mockTx as unknown as Transaction,
        ),
      ).rejects.toThrow(error);
      expect(mockTx.transaction).toHaveBeenCalled();
      expect(mockDb.transaction).not.toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(mockNestedTx);
    });
  });
});
