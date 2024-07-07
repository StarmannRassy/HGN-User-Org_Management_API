"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    static associate(models) {
      Organization.belongsToMany(models.User, {
        through: "UserOrganizations",
        as: "users",
        foreignKey: "orgId",
      });
    }
  }

  Organization.init(
    {
      orgId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Organization",
    }
  );

  return Organization;
};
