const { DataTypes } = require('sequelize');
const sequelize = require('../db/db'); // Adjust the path to your sequelize instance

const UserOrganisation = sequelize.define('UserOrganisation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'userId',
    },
  },
  orgId: {
    type: DataTypes.UUID,
    references: {
      model: 'Organisations',
      key: 'orgId',
    },
  },
});

module.exports = UserOrganisation;
