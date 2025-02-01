import type { Database, Transaction } from "../../src/db/types.js";
import { eq, asc, desc } from "drizzle-orm";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { courses } from "../../src/db/schema.js";
import { CourseRepository } from "../../src/repositories/CourseRepository.js";
import { SortOrder } from "../../src/types/common.js";
import { mockDb, mockTx } from "../mocks/database.mock.js";
import { mockCourse } from "../mocks/entities.mock.js";

describe("CourseRepository", () => {
  const repository = new CourseRepository(mockDb as unknown as Database);

  describe("findById", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("returns course when found", async () => {
      mockDb.limit.mockResolvedValueOnce([mockCourse]);

      const result = await repository.findById(1);

      expect(result).toEqual(mockCourse);
      expect(mockDb.select).toHaveBeenCalled();
    });

    it("returns null when course not found", async () => {
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

    it("returns all courses without constraints", async () => {
      mockDb.$dynamic.mockResolvedValueOnce([
        mockCourse,
        { ...mockCourse, id: 2 },
      ]);

      const results = await repository.findAll();

      expect(results.length).toEqual(2);
      expect(mockDb.limit).not.toHaveBeenCalled();
      expect(mockDb.orderBy).not.toHaveBeenCalled();
    });

    it("applies limit when provided", async () => {
      mockDb.returning.mockResolvedValueOnce([mockCourse]);

      await repository.findAll(1);

      expect(mockDb.limit).toHaveBeenCalledWith(1);
    });

    it("applies ascending sort order when specified", async () => {
      mockDb.returning.mockResolvedValueOnce([mockCourse]);

      await repository.findAll(null, SortOrder.ASC);

      expect(mockDb.limit).not.toHaveBeenCalled();
      expect(mockDb.orderBy).toHaveBeenCalledWith(asc(courses.id));
    });

    it("applies descending sort order when specified and applies a limit", async () => {
      mockDb.returning.mockResolvedValueOnce([mockCourse]);

      await repository.findAll(2, SortOrder.DESC);

      expect(mockDb.limit).toHaveBeenCalledWith(2);
      expect(mockDb.orderBy).toHaveBeenCalledWith(desc(courses.id));
    });
  });

  describe("findByCollection", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("returns courses for the given collection id", async () => {
      mockDb.where.mockResolvedValueOnce([
        mockCourse,
        { ...mockCourse, id: 2 },
      ]);

      const results = await repository.findByCollection(1);

      expect(results.length).toEqual(2);
      expect(mockDb.where).toHaveBeenCalledWith(eq(courses.collectionId, 1));
    });

    it("returns empty array when no courses found", async () => {
      mockDb.where.mockResolvedValueOnce([]);

      const results = await repository.findByCollection(1);

      expect(results).toEqual([]);
    });

    it("uses provided transaction when available", async () => {
      await repository.findByCollection(1, mockTx as unknown as Transaction);

      expect(mockTx.select).toHaveBeenCalled();
      expect(mockDb.select).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    const newCourse = {
      title: "New Course",
      description: "A new test course",
      duration: 12,
      outcome: "To learn some stuff",
      collectionId: 1,
    };

    it("returns created course", async () => {
      const createdCourse = { ...newCourse, id: 1 };
      mockDb.returning.mockResolvedValueOnce([createdCourse]);

      const result = await repository.create(newCourse);

      expect(result).toEqual(createdCourse);
    });

    it("calls insert with correct values", async () => {
      mockDb.returning.mockResolvedValueOnce([{ ...newCourse, id: 1 }]);

      await repository.create(newCourse);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith(newCourse);
    });

    it("uses provided transaction when available", async () => {
      await repository.create(newCourse, mockTx as unknown as Transaction);

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

    it("returns updated course when found", async () => {
      const updatedCourse = { ...mockCourse, ...updateData };
      mockDb.returning.mockResolvedValueOnce([updatedCourse]);

      const result = await repository.update(1, updateData);

      expect(result).toEqual(updatedCourse);
      expect(mockDb.where).toHaveBeenCalledWith(eq(courses.id, 1));
    });

    it("returns null when course not found", async () => {
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
      expect(mockDb.where).toHaveBeenCalledWith(eq(courses.id, 1));
    });

    it("uses provided transaction when available", async () => {
      await repository.delete(1, mockTx as unknown as Transaction);

      expect(mockTx.delete).toHaveBeenCalled();
      expect(mockDb.delete).not.toHaveBeenCalled();
    });
  });
});
