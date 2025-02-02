import type { ICourseService } from "./types.js";
import type { Course, NewCourse } from "../db/types.js";
import type { IRepositories } from "../repositories/types.js";
import type { SortOrder } from "../types/common.js";

/**
 * The CourseService class handles the business logic related to course management.
 * It leverages the repositories to abstract away the database interactions.
 */
export class CourseService implements ICourseService {
  constructor(private readonly repos: IRepositories) {}

  /**
   * Retrieves a paginated list of courses with optional sorting.
   *
   * @param limit - Optional limit for pagination.
   * @param sortOrder - Optional sort order for course listing.
   * @returns A list of all matched courses.
   */
  async getCourses(limit?: number, sortOrder?: SortOrder): Promise<Course[]> {
    return this.repos.course.findAll(limit, sortOrder);
  }

  /**
   * Retrieves a specific course by its ID.
   *
   * @param id - The unique identifier of the course.
   * @returns The matched course, or null if nothing was matched.
   */
  async getCourse(id: number): Promise<Course | null> {
    return this.repos.course.findById(id);
  }

  /**
   * Retrieves all courses with a given collection ID.
   *
   * @param collectionId - The unique identifier of the collection.
   * @returns The matched courses.
   */
  async getCoursesByCollection(collectionId: number): Promise<Course[]> {
    return this.repos.course.findByCollection(collectionId);
  }

  /**
   * Creates a new course.
   *
   * @param input - The course creation data.
   * @returns The newly created course.
   */
  async addCourse(input: NewCourse): Promise<Course> {
    if (input.collectionId) {
      const collection = await this.repos.collection.findById(
        input.collectionId,
      );
      if (!collection) {
        throw new Error("Collection was specified but could not be found");
      }
    }

    return this.repos.course.create(input);
  }

  /**
   * Updates an existing course's details.
   *
   * @param id - The unique identifier of the course to update.
   * @param input - The course update data.
   * @returns The modified course, or null if no course was matched.
   */
  async updateCourse(id: number, input: NewCourse): Promise<Course | null> {
    const existingCourse = await this.repos.course.findById(id);
    if (!existingCourse) {
      throw new Error("Course not found");
    }

    if (input.collectionId) {
      const collection = await this.repos.collection.findById(
        input.collectionId,
      );
      if (!collection) {
        throw new Error("Collection was specified but could not be found");
      }
    }

    return this.repos.course.update(id, input);
  }

  /**
   * Removes a course.
   *
   * @param id - The unique identifier of the course to delete.
   */
  async deleteCourse(id: number): Promise<void> {
    const course = await this.repos.course.findById(id);
    if (!course) {
      throw new Error("Course not found");
    }

    await this.repos.course.delete(id);
  }
}
