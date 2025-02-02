import type { Collection, Course, NewCourse } from "../db/types.js";
import type { AuthResponse, DTOUser, SortOrder } from "../types/common.js";

export interface IUserService {
  register(username: string, password: string): Promise<AuthResponse>;
  login(username: string, password: string): Promise<AuthResponse>;
  validateToken(token: string): Promise<DTOUser>;
}

export interface ICourseService {
  getCourses(limit?: number, sortOrder?: SortOrder): Promise<Course[]>;
  getCourse(id: number): Promise<Course | null>;
  getCoursesByCollection(collectionId: number): Promise<Course[]>;
  addCourse(input: NewCourse): Promise<Course>;
  updateCourse(id: number, input: Partial<NewCourse>): Promise<Course | null>;
  deleteCourse(id: number): Promise<void>;
}

export interface ICollectionService {
  getCollections(): Promise<Collection[]>;
  getCollection(id: number): Promise<Collection | null>;
}

export interface IServices {
  user: IUserService;
  course: ICourseService;
  collection: ICollectionService;
}
