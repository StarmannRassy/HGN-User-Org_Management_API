// controllers/organizationController.js

const Organisation = require("../models/organisation"); // Corrected spelling
const UserOrganisation = require("../models/userOrganisation"); // Assuming this model exists
const User = require("../models/user");

// Fetch all organisations for the authenticated user
// const getAllOrganisations = async (req, res) => {
//   try {
//     const { userId } = req.body; // Assuming userId is available after authentication

//     // Log the received userId for debugging purposes
//     console.log("Received userId:", userId);

//     // Fetch the user with the associated organisations
//     const user = await User.findByPk(userId, {
//       include: {
//         model: User.sequelize.models.Organisation,
//         attributes: ["orgId", "name", "description"], // Use correct attributes from your Organisation table
//         through: { attributes: [] }, // Exclude through table attributes
//       },
//     });

//     if (!user) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found",
//       });
//     }

//     const organisations = user.Organisations; // Extract organisations from the user

//     res.status(200).json({
//       status: "success",
//       message: "Organisations fetched successfully",
//       data: {
//         organisations,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching organisations:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to fetch organisations",
//       error: error.message,
//     });
//   }
// };

const getAllOrganisations = async (req, res) => {
  try {
    const { userId } = req.body; // Assuming userId is available after authentication

    // Log the received userId for debugging purposes
    console.log("Received userId:", userId);

    // Fetch the user with the associated organisations
    const user = await User.findByPk(userId, {
      include: {
        model: Organisation,
        attributes: ["orgId", "name", "description"],
        through: { attributes: [] }, // Use correct attributes from your Organisation table
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const organisations = user.Organisations; // Extract organisations from the user

    res.status(200).json({
      status: "success",
      message: "Organisations fetched successfully",
      data: {
        organisations,
      },
    });
  } catch (error) {
    console.error("Error fetching organisations:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch organisations",
      error: error.message,
    });
  }
};

// Fetch a single organisation record
const getOrganisationById = async (req, res) => {
  try {
    const { orgId } = req.params;

    const organisation = await Organisation.findOne({
      where: {
        orgId,
      },
      attributes: ["orgId", "name", "description"],
    });

    if (!organisation) {
      return res.status(404).json({
        status: "error",
        message: "Organisation not found", // Corrected spelling
      });
    }

    // Logic to ensure user has access to this organisation (e.g., check permissions)

    res.status(200).json({
      status: "success",
      message: "Organisation fetched successfully", // Corrected spelling
      data: organisation,
    });
  } catch (error) {
    console.error("Error fetching organisation:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch organisation", // Corrected spelling
      error: error.message,
    });
  }
};

// Create a new organisation

// Create a new organisation
// Create a new organisation
const createOrganisation = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Name is required",
      });
    }

    const newOrganisation = await Organisation.create({
      name,
      description,
      creatorId: req.user.id, // Assuming creatorId is set based on authenticated user
    });

    res.status(201).json({
      status: "success",
      message: "Organisation created successfully", // Corrected spelling
      data: newOrganisation,
    });
  } catch (error) {
    console.error("Error creating organisation:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create organisation", // Corrected spelling
      error: error.message,
    });
  }
};

// Add a user to a particular organisation
const addUserToOrganisation = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { userId } = req.body;

    const organisation = await Organisation.findByPk(orgId);
    if (!organisation) {
      return res.status(404).json({
        status: "error",
        message: "Organisation not found",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    await organisation.addUser(user);

    res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
    });
  } catch (error) {
    console.error("Error adding user to organisation:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to add user to organisation",
      error: error.message,
    });
  }
};

module.exports = {
  getAllOrganisations,
  getOrganisationById,
  createOrganisation,
  addUserToOrganisation,
};
