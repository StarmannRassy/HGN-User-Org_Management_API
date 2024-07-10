const { User, Organisation, UserOrganisation } = require("../../../src/models"); // Adjust path as necessary

describe("Model Associations", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Sync model with the database, dropping existing tables
  });

  it("should associate User with Organisation through UserOrganisation", async () => {
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

    // Associate user with organisation
    await user.addOrganisation(organisation);

    // Query the associations
    const organisations = await user.getOrganisations();

    // Assertions
    expect(organisations).toHaveLength(1);
    expect(organisations[0].name).toBe("Example Org");
  });

  it("should associate Organisation with User through UserOrganisation", async () => {
    // Create mock users and organisation
    const user = await User.create({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      password: "password456",
      phone: "9876543210",
    });

    const organisation = await Organisation.create({
      name: "Another Org",
      description: "This is another organization",
    });

    // Associate organisation with user
    await organisation.addUser(user);

    // Query the associations
    const users = await organisation.getUsers();

    // Assertions
    expect(users).toHaveLength(1);
    expect(users[0].firstName).toBe("Jane");
  });
});
