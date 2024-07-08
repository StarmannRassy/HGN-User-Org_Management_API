const { config } = require("dotenv");
const { Sequelize } = require("sequelize");
config();
const fs = require("fs");
const path = require("path");

// Read the CA certificate from file
const caCert = fs.readFileSync(path.resolve(__dirname, "ca-cert.pem"), "utf8");

// Define your database configuration directly
const dbConfig = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
        ca: caCert,
      },
    },
  },
  production: {
    username: "production_username",
    password: "production_password",
    database: "production_db",
    host: "production_host",
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: true,
    },
  },
};

// Initialize Sequelize with configuration
const sequelize = new Sequelize(
  dbConfig.development.database,
  dbConfig.development.username,
  dbConfig.development.password,
  {
    host: dbConfig.development.host,
    port: dbConfig.development.port,
    dialect: dbConfig.development.dialect,
    dialectOptions: dbConfig.development.dialectOptions,
  }
);

module.exports = sequelize;
