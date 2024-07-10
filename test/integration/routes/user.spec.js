const request = require("supertest");
const express = require("express");
const router = require("../../../src/routes/user"); // Assuming this is your router
const getUserById = require("../../../src/controllers/user");
const { User } = require("../../../src/models"); // Assuming your models are imported correctly
const { generateToken } = require("../../../src/utils/generateToken"); // Assuming this utility exists
const { authenticateToken } = require("../../../src/middlewares/auth"); // Assuming this middleware exists

jest.mock("../models"); // Mock Sequelize models

const app = express();
app.use(express.json());
app.use("/", router); // Mount your router

describe("User Routes", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("GET /api/users/:id", () => {
    it("should fetch user by id", async () => {
      const mockUserId = "mockUserId";
      const req = {
        params: { id: mockUserId },
        headers: { authorization: `Bearer ${generateToken(mockUserId)}` },
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

      User.findByPk.mockResolvedValueOnce(mockUser); // Mock user found

      await getUserById(req, res);

      expect(User.findByPk).toHaveBeenCalledWith("mockUserId");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: mockUser })
      );
    });

    it("should handle user not found", async () => {
      const req = {
        params: { id: "nonExistentUserId" }, // Non-existent userId
        headers: { authorization: `Bearer ${generateToken("mockUserId")}` },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findByPk.mockResolvedValueOnce(null); // Mock user not found

      await getUserById(req, res);

      expect(User.findByPk).toHaveBeenCalledWith("nonExistentUserId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User not found" })
      );
    });

    it("should handle error fetching user", async () => {
      const req = {
        params: { id: "mockUserId" },
        headers: { authorization: `Bearer ${generateToken("mockUserId")}` },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findByPk.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      await getUserById(req, res);

      expect(User.findByPk).toHaveBeenCalledWith("mockUserId");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "An error occurred while retrieving the user",
        })
      );
    });
  });
});
