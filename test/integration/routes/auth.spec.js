const request = require("supertest");
const express = require("express");
const router = require("../../../src/routes/auth"); // Assuming this is your router
const { register, login } = require("../../../src/controllers/auth");
const { User } = require("../../../src/models/user");
const { generateToken } = require("../../../src/utils/generateToken"); // Assuming this utility exists

jest.mock("../models"); // Mock Sequelize model

const app = express();
app.use(express.json());
app.use("/", router); // Mount your router

describe("Authentication Routes", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("POST /register", () => {
    it("should register a new user", async () => {
      const req = {
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "password123",
          phone: "1234567890",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValueOnce(null); // Mock no existing user
      User.create.mockResolvedValueOnce({}); // Mock user creation

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "john.doe@example.com" },
      });
      expect(User.create).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phone: "1234567890",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: "success" })
      );
    });

    it("should handle registration failure due to existing user", async () => {
      const req = {
        body: {
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          password: "password456",
          phone: "9876543210",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValueOnce({ email: "jane.smith@example.com" }); // Mock existing user

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "jane.smith@example.com" },
      });
      expect(User.create).not.toHaveBeenCalled(); // Should not create user
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User already exists" })
      );
    });
  });

  describe("POST /login", () => {
    it("should login a user with valid credentials", async () => {
      const req = {
        body: {
          email: "john.doe@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUser = {
        userId: "mockUserId",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
      };

      User.findOne.mockResolvedValueOnce(mockUser); // Mock user found
      const mockToken = generateToken(mockUser.userId); // Mock generated token

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "john.doe@example.com" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          data: expect.objectContaining({ accessToken: mockToken }),
        })
      );
    });

    it("should handle login failure with invalid credentials", async () => {
      const req = {
        body: {
          email: "jane.doe@example.com",
          password: "invalidpassword",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValueOnce(null); // Mock user not found

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "jane.doe@example.com" },
      });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Authentication failed",
        })
      );
    });
  });
});
