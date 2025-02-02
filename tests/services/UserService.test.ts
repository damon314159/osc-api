import "dotenv/config";
import type { IRepositories } from "../../src/repositories/types.js";
import jwt from "jsonwebtoken";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { UserService } from "../../src/services/UserService.js";
import { hashPassword } from "../../src/utils/auth.js";
import { getUserDto } from "../../src/utils/getUserDto.js";
import { mockUser } from "../mocks/entities.mock.js";
import {
  mockRepositories,
  mockUserRepository,
} from "../mocks/repositories.mock.js";

describe("UserService", () => {
  const service = new UserService(mockRepositories as IRepositories);

  describe("login", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    const username = "example-username";
    const password = "password123";

    it("returns user when credentials are valid", async () => {
      const userWithProperHash = {
        ...mockUser,
        password: await hashPassword(mockUser.password),
      };
      mockUserRepository.findByUsername.mockResolvedValueOnce(
        userWithProperHash,
      );

      const result = await service.login(mockUser.username, mockUser.password);

      expect(result.user).toEqual(getUserDto(userWithProperHash));
      expect(result.token).toEqual(expect.any(String));
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(
        mockUser.username,
      );
    });

    it("throws error when user not found", async () => {
      mockUserRepository.findByUsername.mockResolvedValueOnce(null);

      await expect(service.login(username, password)).rejects.toThrow();
    });

    it("throws error when password is invalid", async () => {
      mockUserRepository.findByUsername.mockResolvedValueOnce({
        ...mockUser,
        password: "$different-password-hash",
      });

      await expect(service.login(username, password)).rejects.toThrow();
    });
  });

  describe("register", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    const username = "newuser";
    const password = "password123";

    it("creates new user when username is available", async () => {
      mockUserRepository.findByUsername.mockResolvedValueOnce(null);
      mockUserRepository.create.mockResolvedValueOnce(mockUser);

      const result = await service.register(username, password);

      expect(result.user).toEqual(getUserDto(mockUser));
      expect(result.token).toEqual(expect.any(String));
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it("throws error when username already exists", async () => {
      mockUserRepository.findByUsername.mockResolvedValueOnce(mockUser);

      await expect(service.register(username, password)).rejects.toThrow();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("validateToken", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    const token = jwt.sign(
      { username: mockUser.username },
      process.env.JWT_SECRET ?? "",
    );

    it("returns user when token is valid", async () => {
      mockUserRepository.findByUsername.mockResolvedValueOnce(mockUser);

      const result = await service.validateToken(token);

      expect(result).toEqual(getUserDto(mockUser));
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(
        mockUser.username,
      );
    });

    it("throws error when user does not exist", async () => {
      mockUserRepository.findById.mockResolvedValueOnce(null);

      await expect(service.validateToken("not-a-valid-jwt")).rejects.toThrow();
    });
  });
});
