const {
  getAllOrganisations,
  getOrganisationById,
  createOrganisation,
  addUserToOrganisation,
} = require("../../../src/controllers/organisations");
const { User, Organisation } = require("../../../src/models");

jest.mock("../models"); // Mock Sequelize models

describe("Organisation Controller Tests", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("getAllOrganisations", () => {
    it("should fetch organisations for a user", async () => {
      const req = { body: { userId: "mockUserId" } };
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
        Organisations: [
          { orgId: "org1", name: "Org 1", description: "Description 1" },
        ],
      };

      User.findByPk.mockResolvedValueOnce(mockUser);

      await getAllOrganisations(req, res);

      expect(User.findByPk).toHaveBeenCalledWith("mockUserId", {
        include: expect.objectContaining({
          model: Organisation,
          attributes: ["orgId", "name", "description"],
        }),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Organisations fetched successfully",
        data: {
          organisations: mockUser.Organisations,
        },
      });
    });

    it("should handle user not found", async () => {
      const req = { body: { userId: "nonExistingUserId" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findByPk.mockResolvedValueOnce(null);

      await getAllOrganisations(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(
        "nonExistingUserId",
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "User not found",
      });
    });

    it("should handle internal server error", async () => {
      const req = { body: { userId: "mockUserId" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findByPk.mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      await getAllOrganisations(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(
        "mockUserId",
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Failed to fetch organisations",
        error: "Database connection failed",
      });
    });
  });

  describe("getOrganisationById", () => {
    it("should fetch organisation by id", async () => {
      const req = { params: { orgId: "mockOrgId" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockOrganisation = {
        orgId: "mockOrgId",
        name: "Mock Organisation",
        description: "Description of Mock Organisation",
      };

      Organisation.findOne.mockResolvedValueOnce(mockOrganisation);

      await getOrganisationById(req, res);

      expect(Organisation.findOne).toHaveBeenCalledWith({
        where: { orgId: "mockOrgId" },
        attributes: ["orgId", "name", "description"],
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Organisation fetched successfully",
        data: mockOrganisation,
      });
    });

    it("should handle organisation not found", async () => {
      const req = { params: { orgId: "nonExistingOrgId" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Organisation.findOne.mockResolvedValueOnce(null);

      await getOrganisationById(req, res);

      expect(Organisation.findOne).toHaveBeenCalledWith({
        where: { orgId: "nonExistingOrgId" },
        attributes: ["orgId", "name", "description"],
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Organisation not found",
      });
    });

    it("should handle internal server error", async () => {
      const req = { params: { orgId: "mockOrgId" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Organisation.findOne.mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      await getOrganisationById(req, res);

      expect(Organisation.findOne).toHaveBeenCalledWith({
        where: { orgId: "mockOrgId" },
        attributes: ["orgId", "name", "description"],
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Failed to fetch organisation",
        error: "Database connection failed",
      });
    });
  });

  describe("createOrganisation", () => {
    it("should create a new organisation", async () => {
      const req = {
        body: { name: "New Org", description: "Description of New Org" },
        user: { id: "mockUserId" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockOrganisation = {
        orgId: "mockOrgId",
        name: "New Org",
        description: "Description of New Org",
        creatorId: "mockUserId",
      };

      Organisation.create.mockResolvedValueOnce(mockOrganisation);

      await createOrganisation(req, res);

      expect(Organisation.create).toHaveBeenCalledWith({
        name: "New Org",
        description: "Description of New Org",
        creatorId: "mockUserId",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Organisation created successfully",
        data: mockOrganisation,
      });
    });

    it("should handle missing name field", async () => {
      const req = {
        body: { description: "Description of New Org" },
        user: { id: "mockUserId" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createOrganisation(req, res);

      expect(Organisation.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "Bad Request",
        message: "Name is required",
      });
    });

    it("should handle internal server error", async () => {
      const req = {
        body: { name: "New Org", description: "Description of New Org" },
        user: { id: "mockUserId" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Organisation.create.mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      await createOrganisation(req, res);

      expect(Organisation.create).toHaveBeenCalledWith({
        name: "New Org",
        description: "Description of New Org",
        creatorId: "mockUserId",
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Failed to create organisation",
        error: "Database connection failed",
      });
    });
  });

  describe("addUserToOrganisation", () => {
    it("should add user to organisation", async () => {
      const req = {
        params: { orgId: "mockOrgId" },
        body: { userId: "mockUserId" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockOrganisation = { orgId: "mockOrgId" };
      const mockUser = { userId: "mockUserId" };

      Organisation.findByPk.mockResolvedValueOnce(mockOrganisation);
      User.findByPk.mockResolvedValueOnce(mockUser);
      Organisation.prototype.addUser = jest.fn();

      await addUserToOrganisation(req, res);

      expect(Organisation.findByPk).toHaveBeenCalledWith("mockOrgId");
      expect(User.findByPk).toHaveBeenCalledWith("mockUserId");
      expect(Organisation.prototype.addUser).toHaveBeenCalledWith(mockUser);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "User added to organisation successfully",
      });
    });

    it("should handle organisation not found", async () => {
      const req = {
        params: { orgId: "nonExistingOrgId" },
        body: { userId: "mockUserId" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Organisation.findByPk.mockResolvedValueOnce(null);

      await addUserToOrganisation(req, res);

      expect(Organisation.findByPk).toHaveBeenCalledWith("nonExistingOrgId");
      expect(User.findByPk).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Organisation not found",
      });
    });

    it("should handle user not found", async () => {
      const req = {
        params: { orgId: "mockOrgId" },
        body: { userId: "nonExistingUserId" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockOrganisation = { orgId: "mockOrgId" };

      Organisation.findByPk.mockResolvedValueOnce(mockOrganisation);
      User.findByPk.mockResolvedValueOnce(null);

      await addUserToOrganisation(req, res);

      expect(Organisation.findByPk).toHaveBeenCalledWith("mockOrgId");
      expect(User.findByPk).toHaveBeenCalledWith("nonExistingUserId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "User not found",
      });
    });

    it("should handle internal server error", async () => {
      const req = {
        params: { orgId: "mockOrgId" },
        body: { userId: "mockUserId" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Organisation.findByPk.mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      await addUserToOrganisation(req, res);

      expect(Organisation.findByPk).toHaveBeenCalledWith("mockOrgId");
      expect(User.findByPk).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Failed to add user to organisation",
        error: "Database connection failed",
      });
    });
  });
});
