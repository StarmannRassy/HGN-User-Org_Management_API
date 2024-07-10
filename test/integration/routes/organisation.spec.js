const request = require("supertest");
const express = require("express");
const router = require("../../../src/routes/organisation"); // Assuming this is your router
const {
  getAllOrganisations,
  getOrganisationById,
  createOrganisation,
  addUserToOrganisation,
} = require("../../../src/controllers/organisations");
const { Organisation, User } = require("../../../src/models"); // Assuming your models are imported correctly
const { generateToken } = require("../../../src/utils/generateToken"); // Assuming this utility exists
const { authenticateToken } = require("../../../src/middlewares/auth"); // Assuming this middleware exists

jest.mock("../models"); // Mock Sequelize models

const app = express();
app.use(express.json());
app.use("/", router); // Mount your router

describe("Organisation Routes", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("GET /api/organisations", () => {
    it("should fetch all organisations for an authenticated user", async () => {
      const mockUserId = "mockUserId";
      const req = {
        body: { userId: mockUserId },
        headers: { authorization: `Bearer ${generateToken(mockUserId)}` },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockOrganisations = [
        { orgId: "1", name: "Organisation 1", description: "Description 1" },
        { orgId: "2", name: "Organisation 2", description: "Description 2" },
      ];

      Organisation.findAll.mockResolvedValueOnce(mockOrganisations); // Mock organisations found

      await getAllOrganisations(req, res);

      expect(Organisation.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: { organisations: mockOrganisations } })
      );
    });

    it("should handle error fetching organisations", async () => {
      const mockUserId = "mockUserId";
      const req = {
        body: { userId: mockUserId },
        headers: { authorization: `Bearer ${generateToken(mockUserId)}` },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Organisation.findAll.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      await getAllOrganisations(req, res);

      expect(Organisation.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Failed to fetch organisations" })
      );
    });
  });

  describe("GET /api/organisations/:orgId", () => {
    it("should fetch a single organisation by orgId", async () => {
      const req = {
        params: { orgId: "1" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockOrganisation = {
        orgId: "1",
        name: "Organisation 1",
        description: "Description 1",
      };

      Organisation.findOne.mockResolvedValueOnce(mockOrganisation); // Mock organisation found

      await getOrganisationById(req, res);

      expect(Organisation.findOne).toHaveBeenCalledWith({
        where: { orgId: "1" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: mockOrganisation })
      );
    });

    it("should handle organisation not found", async () => {
      const req = {
        params: { orgId: "999" }, // Non-existent orgId
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Organisation.findOne.mockResolvedValueOnce(null); // Mock organisation not found

      await getOrganisationById(req, res);

      expect(Organisation.findOne).toHaveBeenCalledWith({
        where: { orgId: "999" },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Organisation not found" })
      );
    });

    it("should handle error fetching organisation", async () => {
      const req = {
        params: { orgId: "1" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Organisation.findOne.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      await getOrganisationById(req, res);

      expect(Organisation.findOne).toHaveBeenCalledWith({
        where: { orgId: "1" },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Failed to fetch organisation" })
      );
    });
  });

  describe("POST /api/organisations", () => {
    it("should create a new organisation", async () => {
      const req = {
        body: {
          name: "New Organisation",
          description: "Description of New Organisation",
        },
        user: { id: "mockUserId" }, // Mock authenticated user
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockOrganisation = {
        orgId: "mockOrgId",
        name: "New Organisation",
        description: "Description of New Organisation",
      };

      Organisation.create.mockResolvedValueOnce(mockOrganisation); // Mock organisation creation

      await createOrganisation(req, res);

      expect(Organisation.create).toHaveBeenCalledWith({
        name: "New Organisation",
        description: "Description of New Organisation",
        creatorId: "mockUserId",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: mockOrganisation })
      );
    });

    it("should handle missing name field", async () => {
      const req = {
        body: { description: "Description of New Organisation" },
        user: { id: "mockUserId" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createOrganisation(req, res);

      expect(Organisation.create).not.toHaveBeenCalled(); // Should not create organisation
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Name is required" })
      );
    });

    it("should handle error creating organisation", async () => {
      const req = {
        body: {
          name: "New Organisation",
          description: "Description of New Organisation",
        },
        user: { id: "mockUserId" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Organisation.create.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      await createOrganisation(req, res);

      expect(Organisation.create).toHaveBeenCalledWith({
        name: "New Organisation",
        description: "Description of New Organisation",
        creatorId: "mockUserId",
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Failed to create organisation" })
      );
    });
  });

  describe("POST /api/organisations/:orgId/users", () => {
    it("should add a user to an organisation", async () => {
      const req = {
        params: { orgId: "1" },
        body: { userId: "mockUserId" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockOrganisation = {
        orgId: "1",
        name: "Organisation 1",
        description: "Description 1",
      };
      const mockUser = {
        userId: "mockUserId",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
      };

      Organisation.findByPk.mockResolvedValueOnce(mockOrganisation); // Mock organisation found
      User.findByPk.mockResolvedValueOnce(mockUser); // Mock user found
      Organisation.prototype.addUser.mockResolvedValueOnce(); // Mock user added to organisation

      await addUserToOrganisation(req, res);

      expect(Organisation.findByPk).toHaveBeenCalledWith("1");
      expect(User.findByPk).toHaveBeenCalledWith("mockUserId");
      expect(Organisation.prototype.addUser).toHaveBeenCalledWith(mockUser);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "User added to organisation successfully",
        })
      );
    });

    it("should handle organisation not found", async () => {
      const req = {
        params: { orgId: "999" },
        body: { userId: "mockUserId" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Organisation.findByPk.mockResolvedValueOnce(null); // Mock organisation not found

      await addUserToOrganisation(req, res);

      expect(Organisation.findByPk).toHaveBeenCalledWith("999");
      expect(User.findByPk).not.toHaveBeenCalled(); // Should not attempt to find user
      expect(Organisation.prototype.addUser).not.toHaveBeenCalled(); // Should not attempt to add user
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Organisation not found" })
      );
    });

    it("should handle user not found", async () => {
      const req = {
        params: { orgId: "1" },
        body: { userId: "nonExistentUserId" }, // Non-existent user
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockOrganisation = {
        orgId: "1",
        name: "Organisation 1",
        description: "Description 1",
      };

      Organisation.findByPk.mockResolvedValueOnce(mockOrganisation); // Mock organisation found
      User.findByPk.mockResolvedValueOnce(null); // Mock user not found

      await addUserToOrganisation(req, res);

      expect(Organisation.findByPk).toHaveBeenCalledWith("1");
      expect(User.findByPk).toHaveBeenCalledWith("nonExistentUserId");
      expect(Organisation.prototype.addUser).not.toHaveBeenCalled(); // Should not attempt to add user
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User not found" })
      );
    });

    it("should handle error adding user to organisation", async () => {
      const req = {
        params: { orgId: "1" },
        body: { userId: "mockUserId" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockOrganisation = {
        orgId: "1",
        name: "Organisation 1",
        description: "Description 1",
      };
      const mockUser = {
        userId: "mockUserId",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
      };

      Organisation.findByPk.mockResolvedValueOnce(mockOrganisation); // Mock organisation found
      User.findByPk.mockResolvedValueOnce(mockUser); // Mock user found
      Organisation.prototype.addUser.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      await addUserToOrganisation(req, res);

      expect(Organisation.findByPk).toHaveBeenCalledWith("1");
      expect(User.findByPk).toHaveBeenCalledWith("mockUserId");
      expect(Organisation.prototype.addUser).toHaveBeenCalledWith(mockUser);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to add user to organisation",
        })
      );
    });
  });
});
