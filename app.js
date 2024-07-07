const dotenv = require("dotenv");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sequelize = require("./config/db"); // Import Sequelize instance from db.js
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const organizationRoutes = require("./routes/auth");
const { authenticateToken } = require("./middlewares/auth");

dotenv.config();
port = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());

// // Routes
app.use("/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/api/users", authenticateToken, userRoutes);
app.use("/api/organisations", authenticateToken, organizationRoutes);

// Sync database
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

app.listen(port, () => {
  console.log(`Server Listening on port ${port}`);
});
