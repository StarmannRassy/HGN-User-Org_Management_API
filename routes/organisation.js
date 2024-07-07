const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationController");
const generateToken = require("../utils/generateToken");

router.get("/", generateToken, organizationController.getAllOrganizations);
router.get("/:orgId", generateToken, organizationController.getOrganization);
router.post("/", generateToken, organizationController.createOrganization);
router.post(
  "/:orgId/users",
  generateTokenT,
  organizationController.addUserToOrganization
);

module.exports = router;
