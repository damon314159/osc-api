import type { IRepositories } from "../../src/repositories/types.js";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { CollectionService } from "../../src/services/CollectionService.js";
import { mockCollection } from "../mocks/entities.mock.js";
import {
  mockRepositories,
  mockCollectionRepository,
} from "../mocks/repositories.mock.js";

describe("CollectionService", () => {
  const service = new CollectionService(mockRepositories as IRepositories);

  describe("getCollections", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("returns all collections", async () => {
      mockCollectionRepository.findAll.mockResolvedValueOnce([mockCollection]);

      const result = await service.getCollections();

      expect(result).toEqual([mockCollection]);
      expect(mockCollectionRepository.findAll).toHaveBeenCalled();
    });

    it("returns empty array when no collections exist", async () => {
      mockCollectionRepository.findAll.mockResolvedValueOnce([]);

      const result = await service.getCollections();

      expect(result).toEqual([]);
    });
  });

  describe("getCollection", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("returns collection when found", async () => {
      mockCollectionRepository.findById.mockResolvedValueOnce(mockCollection);

      const result = await service.getCollection(1);

      expect(result).toEqual(mockCollection);
      expect(mockCollectionRepository.findById).toHaveBeenCalledWith(1);
    });

    it("returns null when collection not found", async () => {
      mockCollectionRepository.findById.mockResolvedValueOnce(null);

      const result = await service.getCollection(999);

      expect(result).toBeNull();
      expect(mockCollectionRepository.findById).toHaveBeenCalledWith(999);
    });
  });
});
