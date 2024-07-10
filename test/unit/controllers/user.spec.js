const { getUserById } = require("../../../src/controllers/user");
const { User } = require("../../../src/models/user");

jest.mock("../models"); // Mock Sequelize model

describe("getUserById", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should retrieve user by id", async () => {
    const req = { params: { id: "mockUserId" } };
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

    User.findByPk.mockResolvedValueOnce(mockUser);

    await getUserById(req, res);

    expect(User.findByPk).toHaveBeenCalledWith("mockUserId");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "User retrieved successfully",
      data: {
        userId: "mockUserId",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
      },
    });
  });

  it("should handle user not found", async () => {
    const req = { params: { id: "nonExistingUserId" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findByPk.mockResolvedValueOnce(null);

    await getUserById(req, res);

    expect(User.findByPk).toHaveBeenCalledWith("nonExistingUserId");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "User not found",
    });
  });

  it("should handle internal server error", async () => {
    const req = { params: { id: "mockUserId" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findByPk.mockRejectedValueOnce(
      new Error("Database connection failed")
    );

    await getUserById(req, res);

    expect(User.findByPk).toHaveBeenCalledWith("mockUserId");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "An error occurred while retrieving the user",
    });
  });
});
