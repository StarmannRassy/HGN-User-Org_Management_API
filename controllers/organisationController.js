const { Organization, User } = require("../db/models");
const { v4: uuidv4 } = require("uuid");

exports.getAllOrganizations = async (req, res) => {
  const userId = req.user.userId;

  try {
    const organizations = await Organization.findAll({
      include: [
        {
          model: User,
          as: "users",
          where: { userId },
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).json({
      status: "success",
      message: "Organizations retrieved successfully",
      data: {
        organizations: organizations.map((org) => ({
          orgId: org.orgId,
          name: org.name,
          description: org.description,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      message: "An error occurred while retrieving organizations",
      statusCode: 500,
    });
  }
};

exports.getOrganization = async (req, res) => {
  const { orgId } = req.params;
  const userId = req.user.userId;

  try {
    const organization = await Organization.findOne({
      where: { orgId },
      include: [
        {
          model: User,
          as: "users",
          where: { userId },
          through: { attributes: [] },
        },
      ],
    });

    if (!organization) {
      return res.status(404).json({
        status: "Not Found",
        message: "Organization not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Organization retrieved successfully",
      data: {
        orgId: organization.orgId,
        name: organization.name,
        description: organization.description,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      message: "An error occurred while retrieving the organization",
      statusCode: 500,
    });
  }
};

exports.createOrganization = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.userId;

  try {
    const orgId = uuidv4();
    const organization = await Organization.create({
      orgId,
      name,
      description,
    });

    const user = await User.findByPk(userId);
    await user.addOrganization(organization);

    res.status(201).json({
      status: "success",
      message: "Organization created successfully",
      data: {
        orgId: organization.orgId,
        name: organization.name,
        description: organization.description,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
};

exports.addUserToOrganization = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  try {
    const organization = await Organization.findByPk(orgId);
    if (!organization) {
      return res.status(404).json({
        status: "Not Found",
        message: "Organization not found",
        statusCode: 404,
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found",
        statusCode: 404,
      });
    }

    await organization.addUser(user);

    res.status(200).json({
      status: "success",
      message: "User added to organization successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
};
