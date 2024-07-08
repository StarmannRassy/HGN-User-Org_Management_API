const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const request = require("supertest");
const app = require("../app"); // Replace with your app file path
const { User } = require("../src/models"); // Adjust according to your project structure

dotenv.config();

// Test Token Generation
describe("Token Generation", () => {
  let accessToken;

  beforeAll(async () => {
    // Assuming a user exists with id 'user123'
    const user = await User.findByPk("user123");
    accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  it("should generate a token with the correct user details and expiration", () => {
    expect(accessToken).toBeDefined();

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    expect(decoded.userId).toBe("user123");
    expect(decoded.exp).toBeGreaterThan(decoded.iat);
  });
});

// Test Registration and Login APIs
describe("Authentication API", () => {
  it("should register a user successfully", async () => {
    const response = await request(app).post("auth/register").send({
      firstName: "maureen",
      lastName: "attah",
      email: "bisi@example.com",
      password: "password",
      phone: "1234567890",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.user.email).toBe("bisi@example.com");
  });

  it("should fail if required fields are missing", async () => {
    const response = await request(app).post("auth/register").send({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
    });

    expect(response.status).toBe(422);
    expect(response.body.errors).toBeDefined();
  });

  it("should fail if there is a duplicate email during registration", async () => {
    await request(app).post("auth/register").send({
      firstName: "maureen",
      lastName: "attah",
      email: "bisi@example.com",
      password: "password",
      phone: "1234567890",
    });

    const response = await request(app).post("auth/register").send({
      firstName: "maureen",
      lastName: "attah",
      email: "bisi@example.com",
      password: "password",
      phone: "0987654321",
    });

    expect(response.status).toBe(422);
    expect(response.body.message).toBe("User already exists");
  });

  it("should login a user successfully", async () => {
    const response = await request(app).post("auth/login").send({
      email: "bisi@example.com",
      password: "password",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user.email).toBe("bisi@example.com");
  });

  it("should fail to login with incorrect credentials", async () => {
    const response = await request(app).post("auth/login").send({
      email: "bisi@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Wrong password");
  });
});
