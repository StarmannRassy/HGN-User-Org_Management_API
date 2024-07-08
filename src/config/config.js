require("dotenv").config();
const fs = require("fs");
const path = require("path");

// Read the CA certificate from file
const caCert = fs.readFileSync(
  path.resolve(__dirname, "../db/ca-cert.pem"),
  "utf8"
);

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
        ca: caCert,
        // ca: fs.readFileSync(process.env.DB_CA_PATH).toString(),
      },
    },
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      ssl: true,
    },
  },
};
