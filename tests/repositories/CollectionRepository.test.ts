import type { Database, Transaction } from "../../src/db/types.js";
import { eq, asc, desc } from "drizzle-orm";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { collections } from "../../src/db/schema.js";
import { CollectionRepository } from "../../src/repositories/CollectionRepository.js";
import { SortOrder } from "../../src/types/common.js";
import { mockDb, mockTx } from "../mocks/database.mock.js";
import { mockCollection } from "../mocks/entities.mock.js";

describe("CollectionRepository", () => {
  const repository = new CollectionRepository(mockDb as unknown as Database);

  describe("findById", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("returns collection when found", async () => {
      mockDb.limit.mockResolvedValueOnce([mockCollection]);

      const result = await repository.findById(1);

      expect(result).toEqual(mockCollection);
      expect(mockDb.select).toHaveBeenCalled();
    });

    it("returns null when collection not found", async () => {
      mockDb.limit.mockResolvedValueOnce([]);

      const result = await repository.findById(0);

      expect(result).toBeNull();
    });

    it("uses provided transaction when available", async () => {
      await repository.findById(1, mockTx as unknown as Transaction);

      expect(mockTx.select).toHaveBeenCalled();
      expect(mockDb.select).not.toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("returns all collections without constraints", async () => {
      mockDb.$dynamic.mockResolvedValueOnce([
        mockCollection,
        { ...mockCollection, id: 2 },
      ]);

      const results = await repository.findAll();

      expect(results.length).toEqual(2);
      expect(mockDb.limit).not.toHaveBeenCalled();
      expect(mockDb.orderBy).not.toHaveBeenCalled();
    });

    it("applies limit when provided", async () => {
      mockDb.returning.mockResolvedValueOnce([mockCollection]);

      await repository.findAll(1);

      expect(mockDb.limit).toHaveBeenCalledWith(1);
    });

    it("applies ascending sort order when specified", async () => {
      mockDb.returning.mockResolvedValueOnce([mockCollection]);

      await repository.findAll(null, SortOrder.ASC);

      expect(mockDb.limit).not.toHaveBeenCalled();
      expect(mockDb.orderBy).toHaveBeenCalledWith(asc(collections.id));
    });

    it("applies descending sort order when specified and applies a limit", async () => {
      mockDb.returning.mockResolvedValueOnce([mockCollection]);

      await repository.findAll(2, SortOrder.DESC);

      expect(mockDb.limit).toHaveBeenCalledWith(2);
      expect(mockDb.orderBy).toHaveBeenCalledWith(desc(collections.id));
    });
  });

  describe("create", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    const newCollection = {
      name: "New Collection",
      description: "A new test collection",
    };

    it("returns created collection", async () => {
      const createdCollection = { ...newCollection, id: 1 };
      mockDb.returning.mockResolvedValueOnce([createdCollection]);

      const result = await repository.create(newCollection);

      expect(result).toEqual(createdCollection);
    });

    it("calls insert with correct values", async () => {
      mockDb.returning.mockResolvedValueOnce([{ ...newCollection, id: 1 }]);

      await repository.create(newCollection);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith(newCollection);
    });

    it("uses provided transaction when available", async () => {
      await repository.create(newCollection, mockTx as unknown as Transaction);

      expect(mockTx.insert).toHaveBeenCalled();
      expect(mockDb.insert).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    const updateData = {
      description: "Updated description",
    };

    it("returns updated collection when found", async () => {
      const updatedCollection = { ...mockCollection, ...updateData };
      mockDb.returning.mockResolvedValueOnce([updatedCollection]);

      const result = await repository.update(1, updateData);

      expect(result).toEqual(updatedCollection);
      expect(mockDb.where).toHaveBeenCalledWith(eq(collections.id, 1));
    });

    it("returns null when collection not found", async () => {
      mockDb.returning.mockResolvedValueOnce([]);

      const result = await repository.update(1, updateData);

      expect(result).toBeNull();
    });

    it("uses provided transaction when available", async () => {
      await repository.update(1, updateData, mockTx as unknown as Transaction);

      expect(mockTx.update).toHaveBeenCalled();
      expect(mockDb.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("calls delete with correct id", async () => {
      await repository.delete(1);

      expect(mockDb.delete).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalledWith(eq(collections.id, 1));
    });

    it("uses provided transaction when available", async () => {
      await repository.delete(1, mockTx as unknown as Transaction);

      expect(mockTx.delete).toHaveBeenCalled();
      expect(mockDb.delete).not.toHaveBeenCalled();
    });
  });
});
