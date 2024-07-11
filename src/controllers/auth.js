// controllers/auth.js

const { ValidationError } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const User = require("../models/user");
// const Organisation = require("../models/organisation");
const { User, Organisation } = require("../models");
const { generateToken } = require("../utils/generateToken");

// Register a new user
async function register(req, res) {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    // You can create the organization here or as needed
    const organisation = await Organisation.create({
      name: `${firstName}'s Organisation`,
      description: `${firstName}'s default organisation`,
    });
    await user.addOrganisation(organisation);

    // Generate JWT token
    const accessToken = generateToken(user.userId);

    // Return response
    res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(422).json({ errors });
    }
    console.error("Error in registration:", error);
    res.status(400).json({
      status: "Bad Request",
      message: "Registration unsuccessful",
    });
  }
}

// Login user
async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ status: "Bad Request", message: "Authentication failed" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "Bad Request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }

    // Generate JWT token
    const accessToken = generateToken(user.userId);

    // Return response
    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({
      status: "Bad Request",
      message: "Server Error",
    });
  }
}

module.exports = {
  register,
  login,
};
