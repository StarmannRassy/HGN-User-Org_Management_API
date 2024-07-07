const { User, Organization } = require("../db/models");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { generateToken } = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  try {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    const orgId = uuidv4();
    const organization = await Organization.create({
      orgId,
      name: `${firstName}'s Organization`,
      description: `Organization of ${firstName}`,
    });

    await user.addOrganization(organization);

    // Generate JWT token
    const accessToken = generateToken(user.userId);

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
    const errors = error.errors.map((err) => ({
      field: err.path,
      message: err.message,
    }));

    res.status(400).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
      errors,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: "Bad request",
        message: "Login unsuccessful",
        statusCode: 400,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "Bad request",
        message: "Login unsuccessful",
        statusCode: 400,
      });
    }

    // Generate JWT token
    const accessToken = generateToken(user.userId);

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
    res.status(400).json({
      status: "Bad request",
      message: "Login unsuccessful",
      statusCode: 401,
    });
  }
};
