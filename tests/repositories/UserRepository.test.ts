import type { Database, Transaction } from "../../src/db/types.js";
import { eq, asc, desc } from "drizzle-orm";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { users } from "../../src/db/schema.js";
import { UserRepository } from "../../src/repositories/UserRepository.js";
import { SortOrder } from "../../src/types/common.js";
import { mockDb, mockTx } from "../mocks/database.mock.js";
import { mockUser } from "../mocks/entities.mock.js";

describe("UserRepository", () => {
  const repository = new UserRepository(mockDb as unknown as Database);

  describe("findById", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("returns user when found", async () => {
      mockDb.limit.mockResolvedValueOnce([mockUser]);

      const result = await repository.findById(1);

      expect(result).toEqual(mockUser);
      expect(mockDb.select).toHaveBeenCalled();
    });

    it("returns null when user not found", async () => {
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

    it("returns all users without constraints", async () => {
      mockDb.$dynamic.mockResolvedValueOnce([mockUser, { ...mockUser, id: 2 }]);

      const results = await repository.findAll();

      expect(results.length).toEqual(2);
      expect(mockDb.limit).not.toHaveBeenCalled();
      expect(mockDb.orderBy).not.toHaveBeenCalled();
    });

    it("applies limit when provided", async () => {
      mockDb.returning.mockResolvedValueOnce([mockUser]);

      await repository.findAll(1);

      expect(mockDb.limit).toHaveBeenCalledWith(1);
    });

    it("applies ascending sort order when specified", async () => {
      mockDb.returning.mockResolvedValueOnce([mockUser]);

      await repository.findAll(null, SortOrder.ASC);

      expect(mockDb.limit).not.toHaveBeenCalled();
      expect(mockDb.orderBy).toHaveBeenCalledWith(asc(users.id));
    });

    it("applies descending sort order when specified and applies a limit", async () => {
      mockDb.returning.mockResolvedValueOnce([mockUser]);

      await repository.findAll(2, SortOrder.DESC);

      expect(mockDb.limit).toHaveBeenCalledWith(2);
      expect(mockDb.orderBy).toHaveBeenCalledWith(desc(users.id));
    });
  });

  describe("findByUsername", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("returns user when found", async () => {
      mockDb.limit.mockResolvedValueOnce([mockUser]);

      const result = await repository.findByUsername("testuser");

      expect(result).toEqual(mockUser);
      expect(mockDb.where).toHaveBeenCalledWith(eq(users.username, "testuser"));
    });

    it("returns null when username not found", async () => {
      mockDb.limit.mockResolvedValueOnce([]);

      const result = await repository.findByUsername("nonexistent");

      expect(result).toBeNull();
    });

    it("uses provided transaction when available", async () => {
      await repository.findByUsername(
        "testuser",
        mockTx as unknown as Transaction,
      );

      expect(mockTx.select).toHaveBeenCalled();
      expect(mockDb.select).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    const newUser = {
      username: "newuser",
      password: "super-long-hash",
    };

    it("returns created user", async () => {
      const createdUser = { ...newUser, id: 1 };
      mockDb.returning.mockResolvedValueOnce([createdUser]);

      const result = await repository.create(newUser);

      expect(result).toEqual(createdUser);
    });

    it("calls insert with correct values", async () => {
      mockDb.returning.mockResolvedValueOnce([{ ...newUser, id: 1 }]);

      await repository.create(newUser);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith(newUser);
    });

    it("uses provided transaction when available", async () => {
      await repository.create(newUser, mockTx as unknown as Transaction);

      expect(mockTx.insert).toHaveBeenCalled();
      expect(mockDb.insert).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    const updateData = {
      password: "a-brand-new-hash",
    };

    it("returns updated user when found", async () => {
      const updatedUser = { ...mockUser, ...updateData };
      mockDb.returning.mockResolvedValueOnce([updatedUser]);

      const result = await repository.update(1, updateData);

      expect(result).toEqual(updatedUser);
      expect(mockDb.where).toHaveBeenCalledWith(eq(users.id, 1));
    });

    it("returns null when user not found", async () => {
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
      expect(mockDb.where).toHaveBeenCalledWith(eq(users.id, 1));
    });

    it("uses provided transaction when available", async () => {
      await repository.delete(1, mockTx as unknown as Transaction);

      expect(mockTx.delete).toHaveBeenCalled();
      expect(mockDb.delete).not.toHaveBeenCalled();
    });
  });
});
