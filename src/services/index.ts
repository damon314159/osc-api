import type { IServices } from "./types.js";
import { repositories } from "../repositories/index.js";
import { Services } from "./Services.js";

// Instantiate the single instance of Services that will be used by the resolver layer.
export const services: IServices = new Services(repositories);
