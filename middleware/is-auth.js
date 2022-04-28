const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (authHeader === undefined) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    var decoded = jwt.verify(token, "shhhhh");

    if (!decoded) {
      const error = new Error("Not authenticated");
      error.statusCode = 401;
      return next(error);
    }

    const getRole = await User.findByPk(decoded.userId);

    if (getRole === null) {
      const error = new Error("Not authenticated");
      error.statusCode = 401;
      return next(error);
    }

    const role = getRole.dataValues.roleId;

    if (req.route.path.includes("Admin") && role != 1) {
      const error = new Error("You are not authorized to access this data");
      error.statusCode = 401;
      return next(error);
    }

    if (req.route.path.includes("Customer") && role != 2) {
      const error = new Error("You are not authorized to access this data");
      error.statusCode = 401;
      return next(error);
    }

    req["userId"] = decoded.userId;

    next();
  } catch (err) {
    console.log(err);

    if (err == "JsonWebTokenError: jwt malformed") {
      const error = new Error("Not authenticated");
      error.statusCode = 401;
      return next(error);
    }

    const error = new Error(
      "Something went wrong. Please contact the administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};
