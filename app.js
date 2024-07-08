const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const db = require("./src/db/db"); // Import Sequelize instance from db.js
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");
const { authenticateToken } = require("./src/middlewares/auth");
const getUserById = require("./src/controllers/user");
// const userRoutes = require("./routes/userRoutes");
const organisationRoutes = require("./src/routes/organisation");

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// // Routes
app.use("/auth", authRoutes);
app.use(userRoutes);
app.use(organisationRoutes);
// app.use("/api/users/:id", authenticateToken, getUserById);

// Protected route example
app.get("/Home", authenticateToken, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

module.exports = app;

// Start the server
db.sync() // Sync Sequelize models with the database
  .then(() => {
    console.log("Database synced. Database & tables created!");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to sync database:", error);
  });
