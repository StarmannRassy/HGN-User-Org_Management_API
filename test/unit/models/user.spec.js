const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../../../src/db/db"); // Path to your db.js file
const User = require("../../../src/models/user"); // Path to your User model

describe("User Model", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Sync model with the database, dropping existing tables
  });

  it("should create a new user", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
    };

    const user = await User.create(userData);

    // Assertions
    expect(user).toHaveProperty("userId");
    expect(user.firstName).toBe(userData.firstName);
    expect(user.lastName).toBe(userData.lastName);
    expect(user.email).toBe(userData.email);
    expect(user.phone).toBe(userData.phone);

    // Password should be hashed
    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.password
    );
    expect(isPasswordValid).toBe(true);
  });

  it("should fail to create a user with invalid data", async () => {
    const invalidUserData = {
      firstName: "123John", // Invalid first name
      lastName: "", // Empty last name
      email: "invalid-email", // Invalid email format
      password: "short", // Password too short
      phone: "invalid phone number", // Invalid phone number format
    };

    let error;
    try {
      await User.create(invalidUserData);
    } catch (err) {
      error = err;
    }

    // Assertions for error messages
    expect(error).toBeDefined();
    expect(error.errors).toHaveLength(5); // Number of validation errors

    // Example specific validation error checks
    expect(error.errors[0].message).toBe(
      "First name must contain only letters and spaces"
    );
    expect(error.errors[1].message).toBe("Last name cannot be empty");
    expect(error.errors[2].message).toBe("Email must be a valid email address");
    expect(error.errors[3].message).toBe(
      "Password must be at least 6 characters long"
    );
    expect(error.errors[4].message).toBe(
      "Phone number must contain only numbers, spaces, plus signs, and hyphens"
    );
  });
});
