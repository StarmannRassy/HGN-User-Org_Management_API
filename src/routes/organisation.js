// routes/organizationRoutes.js

const express = require("express");
const {
  getAllOrganisations,
  getOrganisationById,
  createOrganisation,
  addUserToOrganisation,
} = require("../controllers/organisations");
const { authenticateToken } = require("../middlewares/auth");
const router = express.Router();

// Define routes
router.get("/api/organisations", authenticateToken, getAllOrganisations);
router.get("/api/organisations/:orgId", authenticateToken, getOrganisationById);
router.post("/api/organisations", authenticateToken, createOrganisation);
router.post("/api/organisations/:orgId/users", addUserToOrganisation);

module.exports = router;
