const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

function generateToken(userId) {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
  return accessToken;
}

module.exports = {
  generateToken,
};
