const { DataTypes } = require("sequelize");
const sequelize = require("../../../src/db/db"); // Path to your db.js file
const UserOrganisation = require("../../../src/models/userOrganisation"); // Path to your UserOrganisation model
const User = require("../../../src/models/user"); // Path to your User model
const Organisation = require("../../../src/models/Organisation"); // Path to your Organisation model

describe("UserOrganisation Model", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Sync model with the database, dropping existing tables
  });

  it("should create a new UserOrganisation entry", async () => {
    // Create mock users and organisation
    const user = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    const organisation = await Organisation.create({
      name: "Example Org",
      description: "This is an example organization",
    });

    const userOrganisationData = {
      userId: user.userId,
      orgId: organisation.orgId,
    };

    const userOrganisation = await UserOrganisation.create(
      userOrganisationData
    );

    // Assertions
    expect(userOrganisation).toHaveProperty("id");
    expect(userOrganisation.userId).toBe(user.userId);
    expect(userOrganisation.orgId).toBe(organisation.orgId);
  });

  it("should fail to create a UserOrganisation entry with invalid foreign keys", async () => {
    const invalidUserOrganisationData = {
      userId: "invalidUserId",
      orgId: "invalidOrgId",
    };

    let error;
    try {
      await UserOrganisation.create(invalidUserOrganisationData);
    } catch (err) {
      error = err;
    }

    // Assertions for error messages
    expect(error).toBeDefined();
    expect(error.name).toBe("SequelizeForeignKeyConstraintError");
  });
});
