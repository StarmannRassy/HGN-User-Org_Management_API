const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/:id", (req, res, next) => {
  const userId = req.params.id;

  // Call userController.getUser to handle the logic
  userController.getUser(req, res, userId);
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const userController = require("../controllers/userController");
// const generateToken = require("../utils/generateToken");

// router.get("/:id", (req, res, next) => {
//   const userId = req.params.id;

//   // Generate token and include it in the response
//   const token = generateToken(userId);

//   // Optionally, you might send the token as part of the response
//   res.json({ token: token, userId: userId });
// });

// module.exports = router;
