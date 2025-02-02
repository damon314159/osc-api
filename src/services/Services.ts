import type { IServices } from "./types.js";
import type { IRepositories } from "../repositories/types.js";
import { CollectionService } from "./CollectionService.js";
import { CourseService } from "./CourseService.js";
import { UserService } from "./UserService.js";

/**
 * The service layer acts as the central entry point for interacting with the repositories.
 * By injecting the repos instance only at this sole point, we ensure that there is a total
 * separation of concerns between the layers, with an ergonomic abstraction.
 */
export class Services implements IServices {
  readonly user;
  readonly course;
  readonly collection;

  constructor(repos: IRepositories) {
    this.user = new UserService(repos);
    this.course = new CourseService(repos);
    this.collection = new CollectionService(repos);
  }
}
