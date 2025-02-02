import type { IRepositories } from "../../src/repositories/types.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CourseService } from "../../src/services/CourseService.js";
import { SortOrder } from "../../src/types/common.js";
import { mockCollection, mockCourse } from "../mocks/entities.mock.js";
import {
  mockCollectionRepository,
  mockCourseRepository,
  mockRepositories,
} from "../mocks/repositories.mock.js";

describe("CourseService", () => {
  const service = new CourseService(mockRepositories as IRepositories);

  describe("getCourses", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("returns all courses with no parameters", async () => {
      mockCourseRepository.findAll.mockResolvedValueOnce([
        mockCourse,
        { ...mockCourse, id: 2 },
        { ...mockCourse, id: 3 },
      ]);

      const result = await service.getCourses();

      expect(result).toEqual([
        mockCourse,
        { ...mockCourse, id: 2 },
        { ...mockCourse, id: 3 },
      ]);
      expect(mockCourseRepository.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
      );
    });

    it("returns courses with limit", async () => {
      mockCourseRepository.findAll.mockResolvedValueOnce([mockCourse]);

      const result = await service.getCourses(1);

      expect(result).toEqual([mockCourse]);
      expect(mockCourseRepository.findAll).toHaveBeenCalledWith(1, undefined);
    });

    it("returns courses with sort order", async () => {
      mockCourseRepository.findAll.mockResolvedValueOnce([mockCourse]);

      const result = await service.getCourses(undefined, SortOrder.ASC);

      expect(result).toEqual([mockCourse]);
      expect(mockCourseRepository.findAll).toHaveBeenCalledWith(
        undefined,
        "ASC",
      );
    });

    it("returns courses with both sort order and limit", async () => {
      mockCourseRepository.findAll.mockResolvedValueOnce([mockCourse]);

      const result = await service.getCourses(1, SortOrder.DESC);

      expect(result).toEqual([mockCourse]);
      expect(mockCourseRepository.findAll).toHaveBeenCalledWith(1, "DESC");
    });
  });

  describe("getCourse", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("returns course when found", async () => {
      mockCourseRepository.findById.mockResolvedValueOnce(mockCourse);

      const result = await service.getCourse(1);

      expect(result).toEqual(mockCourse);
      expect(mockCourseRepository.findById).toHaveBeenCalledWith(1);
    });

    it("returns null when course not found", async () => {
      mockCourseRepository.findById.mockResolvedValueOnce(null);

      const result = await service.getCourse(999);

      expect(result).toBeNull();
    });
  });

  describe("getCoursesByCollection", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("returns courses for collection", async () => {
      mockCourseRepository.findByCollection.mockResolvedValueOnce([mockCourse]);

      const result = await service.getCoursesByCollection(1);

      expect(result).toEqual([mockCourse]);
      expect(mockCourseRepository.findByCollection).toHaveBeenCalledWith(1);
    });

    it("returns empty array when no courses found", async () => {
      mockCourseRepository.findByCollection.mockResolvedValueOnce([]);

      const result = await service.getCoursesByCollection(1);

      expect(result).toEqual([]);
    });
  });

  describe("addCourse", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("creates course when collection exists", async () => {
      mockCollectionRepository.findById.mockResolvedValueOnce(mockCollection);
      mockCourseRepository.create.mockResolvedValueOnce(mockCourse);

      const result = await service.addCourse({
        ...mockCourse,
        collectionId: 1,
      });

      expect(result).toEqual(mockCourse);
      expect(mockCourseRepository.create).toHaveBeenCalled();
    });

    it("creates course without collection", async () => {
      mockCourseRepository.create.mockResolvedValueOnce(mockCourse);

      const result = await service.addCourse({
        ...mockCourse,
        collectionId: undefined,
      });

      expect(result).toEqual(mockCourse);
      expect(mockCollectionRepository.findById).not.toHaveBeenCalled();
    });

    it("throws error when collection not found", async () => {
      mockCollectionRepository.findById.mockResolvedValueOnce(null);

      await expect(
        service.addCourse({ ...mockCourse, collectionId: 999 }),
      ).rejects.toThrow("Collection was specified but could not be found");
    });
  });

  describe("updateCourse", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("updates course when found", async () => {
      mockCourseRepository.findById.mockResolvedValueOnce(mockCourse);
      mockCourseRepository.update.mockResolvedValueOnce(mockCourse);

      const result = await service.updateCourse(1, {
        ...mockCourse,
        collectionId: undefined,
      });

      expect(result).toEqual(mockCourse);
    });

    it("throws error when course not found", async () => {
      mockCourseRepository.findById.mockResolvedValueOnce(null);

      await expect(service.updateCourse(999, mockCourse)).rejects.toThrow(
        "Course not found",
      );
    });

    it("throws error when collection not found", async () => {
      mockCourseRepository.findById.mockResolvedValueOnce(mockCourse);
      mockCollectionRepository.findById.mockResolvedValueOnce(null);

      await expect(
        service.updateCourse(1, { ...mockCourse, collectionId: 999 }),
      ).rejects.toThrow("Collection was specified but could not be found");
    });
  });

  describe("deleteCourse", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("deletes course when found", async () => {
      mockCourseRepository.findById.mockResolvedValueOnce(mockCourse);

      await service.deleteCourse(1);

      expect(mockCourseRepository.delete).toHaveBeenCalledWith(1);
    });

    it("throws error when course not found", async () => {
      mockCourseRepository.findById.mockResolvedValueOnce(null);

      await expect(service.deleteCourse(999)).rejects.toThrow(
        "Course not found",
      );
    });
  });
});
