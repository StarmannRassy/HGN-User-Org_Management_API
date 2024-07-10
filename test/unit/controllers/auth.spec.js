const { register, login } = require("../../../src/controllers/auth");
const { User, Organisation } = require("../../../src/models");
const { generateToken } = require("../../../src/utils/generateToken");
const bcrypt = require("bcryptjs");

jest.mock("../models"); // Mock Sequelize models
jest.mock("bcryptjs"); // Mock bcrypt

describe("Auth Controller", () => {
  const mockRequest = (body) => ({ body });
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const req = mockRequest({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phone: "1234567890",
      });
      const res = mockResponse();

      // Mock User.findOne to return null (user does not exist)
      User.findOne.mockResolvedValueOnce(null);

      // Mock User.create to return a mock user
      const mockUser = {
        userId: "mockuserid",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
      };
      User.create.mockResolvedValueOnce(mockUser);

      // Mock Organisation.create to return a mock organisation
      const mockOrg = {
        orgId: "mockorgid",
        name: "John's Organisation",
        description: "John's default organisation",
      };
      Organisation.create.mockResolvedValueOnce(mockOrg);

      // Mock generateToken to return a mock access token
      const mockAccessToken = "mockaccesstoken";
      generateToken.mockReturnValueOnce(mockAccessToken);

      // Call the register function
      await register(req, res);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email },
      });
      expect(User.create).toHaveBeenCalledWith({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
      });
      expect(Organisation.create).toHaveBeenCalledWith({
        name: "John's Organisation",
        description: "John's default organisation",
      });
      expect(generateToken).toHaveBeenCalledWith(mockUser.userId);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Registration successful",
        data: {
          accessToken: mockAccessToken,
          user: {
            userId: mockUser.userId,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            email: mockUser.email,
            phone: mockUser.phone,
          },
        },
      });
    });

    it("should return 400 if user already exists", async () => {
      const req = mockRequest({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phone: "1234567890",
      });
      const res = mockResponse();

      // Mock User.findOne to return an existing user
      User.findOne.mockResolvedValueOnce({ email: req.body.email });

      // Call the register function
      await register(req, res);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email },
      });
      expect(User.create).not.toHaveBeenCalled();
      expect(Organisation.create).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
    });

    it("should handle validation errors", async () => {
      const req = mockRequest({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phone: "1234567890",
      });
      const res = mockResponse();

      // Mock User.findOne to throw a validation error
      User.findOne.mockRejectedValueOnce({
        name: "ValidationError",
        errors: [{ message: "Validation error" }],
      });

      // Call the register function
      await register(req, res);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email },
      });
      expect(User.create).not.toHaveBeenCalled();
      expect(Organisation.create).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ field: undefined, message: "Validation error" }],
      });
    });

    it("should handle other errors", async () => {
      const req = mockRequest({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phone: "1234567890",
      });
      const res = mockResponse();

      // Mock User.findOne to throw a generic error
      User.findOne.mockRejectedValueOnce(new Error("Unexpected error"));

      // Call the register function
      await register(req, res);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email },
      });
      expect(User.create).not.toHaveBeenCalled();
      expect(Organisation.create).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "Bad Request",
        message: "Registration unsuccessful",
      });
    });
  });

  describe("login", () => {
    it("should login an existing user", async () => {
      const req = mockRequest({
        email: "john.doe@example.com",
        password: "password123",
      });
      const res = mockResponse();

      // Mock User.findOne to return a mock user
      const mockUser = {
        userId: "mockuserid",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "hashedpassword",
        phone: "1234567890",
      };
      User.findOne.mockResolvedValueOnce(mockUser);

      // Mock bcrypt.compare to return true (password validation passed)
      bcrypt.compare.mockResolvedValueOnce(true);

      // Mock generateToken to return a mock access token
      const mockAccessToken = "mockaccesstoken";
      generateToken.mockReturnValueOnce(mockAccessToken);

      // Call the login function
      await login(req, res);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        mockUser.password
      );
      expect(generateToken).toHaveBeenCalledWith(mockUser.userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Login successful",
        data: {
          accessToken: mockAccessToken,
          user: {
            userId: mockUser.userId,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            email: mockUser.email,
            phone: mockUser.phone,
          },
        },
      });
    });

    it("should return 401 if user does not exist", async () => {
      const req = mockRequest({
        email: "john.doe@example.com",
        password: "password123",
      });
      const res = mockResponse();

      // Mock User.findOne to return null (user does not exist)
      User.findOne.mockResolvedValueOnce(null);

      // Call the login function
      await login(req, res);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email },
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: "Bad Request",
        message: "Authentication failed",
      });
    });

    it("should return 401 if password is incorrect", async () => {
      const req = mockRequest({
        email: "john.doe@example.com",
        password: "password123",
      });
      const res = mockResponse();

      // Mock User.findOne to return a mock user
      const mockUser = {
        userId: "mockuserid",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "hashedpassword",
        phone: "1234567890",
      };
      User.findOne.mockResolvedValueOnce(mockUser);

      // Mock bcrypt.compare to return false (password validation failed)
      bcrypt.compare.mockResolvedValueOnce(false);

      // Call the login function
      await login(req, res);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        mockUser.password
      );
      expect(generateToken).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: "Bad Request",
        message: "Authentication failed",
        statusCode: 401,
      });
    });

    it("should handle errors", async () => {
      const req = mockRequest({
        email: "john.doe@example.com",
        password: "password123",
      });
      const res = mockResponse();

      // Mock User.findOne to throw an error
      User.findOne.mockRejectedValueOnce(new Error("Unexpected error"));

      // Call the login function
      await login(req, res);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email },
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Bad Request",
        message: "Server Error",
      });
    });
  });
});
