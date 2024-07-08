const express = require("express");
const router = express.Router();
const getUserById = require("../controllers/user");
const { authenticateToken } = require("../middlewares/auth");

router.get("/api/users/:id", authenticateToken, getUserById);

module.exports = router;
