import type { User } from "../db/types.js";

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export type DTOUser = Omit<User, "id" | "password">;

export type AuthResponse = {
  token: string;
  user: DTOUser;
};
