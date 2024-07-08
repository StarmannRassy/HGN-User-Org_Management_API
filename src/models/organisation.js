// models/organisation.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db/db"); // Adjust path as necessary

const Organisation = sequelize.define('Organisation', {
  orgId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
});

module.exports = Organisation;

