import type { IRepositories } from "./types.js";
import { db } from "../db/index.js";
import { Repositories } from "./Repositories.js";

// Instantiate the single instance of Repositories that will be used by the Service layer.
export const repositories: IRepositories = new Repositories(db);
