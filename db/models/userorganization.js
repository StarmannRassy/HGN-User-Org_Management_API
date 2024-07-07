"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserOrganizations = sequelize.define("UserOrganizations", {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orgId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return UserOrganizations;
};
