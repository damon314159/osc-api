import type { IServices } from "../services/types.js";
import type { DTOUser } from "../types/common.js";

export interface Context {
  user?: DTOUser;
  services: IServices;
}
