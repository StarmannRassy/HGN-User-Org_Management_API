const { DataTypes } = require("sequelize");
const sequelize = require("../../../src/db/db"); // Path to your db.js file
const Organisation = require("../../../src/models/Organisation"); // Path to your Organisation model

describe("Organisation Model", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Sync model with the database, dropping existing tables
  });

  it("should create a new organisation", async () => {
    const organisationData = {
      name: "Example Org",
      description: "This is an example organization",
    };

    const organisation = await Organisation.create(organisationData);

    // Assertions
    expect(organisation).toHaveProperty("orgId");
    expect(organisation.name).toBe(organisationData.name);
    expect(organisation.description).toBe(organisationData.description);
  });

  it("should fail to create an organisation with missing required fields", async () => {
    const invalidOrganisationData = {
      // Missing 'name' field
      description: "Invalid organization without name",
    };

    let error;
    try {
      await Organisation.create(invalidOrganisationData);
    } catch (err) {
      error = err;
    }

    // Assertions for error messages
    expect(error).toBeDefined();
    expect(error.errors).toHaveLength(1); // Number of validation errors

    // Example specific validation error check
    expect(error.errors[0].message).toBe("Organisation.name cannot be null");
  });
});
