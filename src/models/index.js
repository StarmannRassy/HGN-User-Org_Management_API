// In your models/index.js or wherever you set up associations
const User = require("./user");
const Organisation = require("./organisation");
const UserOrganisation = require("./userOrganisation");

// Define associations
User.belongsToMany(Organisation, {
  through: "UserOrganisation",
  foreignKey: "userId",
});
Organisation.belongsToMany(User, {
  through: "UserOrganisation",
  foreignKey: "orgId",
});
module.exports = {
  User,
  Organisation,
  UserOrganisation,
};

// // models/index.js or wherever you set up associations
// const User = require('./user');
// const Organisation = require('./organisation');

// // Define associations
// User.hasMany(Organisation, { foreignKey: 'userId', as: 'Organisations' });
// Organisation.belongsTo(User, { foreignKey: 'userId', as: 'User' });

// module.exports = {
//   User,
//   Organisation,
// };
