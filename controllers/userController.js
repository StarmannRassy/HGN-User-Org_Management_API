const { User, Organization } = require("../db/models");
const generateToken = require("../utils/generateToken");

exports.getUser = async (req, res) => {
  const userId = req.params.id;
  const loggedInUserId = req.user.userId;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found",
        statusCode: 404,
      });
    }

    // Generate token
    const token = generateToken(userId);

    const organizations = await Organization.findAll({
      include: [
        {
          model: User,
          as: "users",
          where: { userId: loggedInUserId },
          through: { attributes: [] },
        },
      ],
    });

    const belongsToOrganization = organizations.some((org) =>
      org.users.some((u) => u.userId === userId)
    );

    if (userId !== loggedInUserId && !belongsToOrganization) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You do not have access to this user",
        statusCode: 403,
      });
    }

    res.status(200).json({
      status: "success",
      message: "User record retrieved successfully",
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      message: "An error occurred while retrieving the user record",
      statusCode: 500,
    });
  }
};
