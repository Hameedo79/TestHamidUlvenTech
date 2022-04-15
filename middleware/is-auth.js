const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (authHeader === undefined) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    return next(error);
  }

  try {
    const token = authHeader.split(" ")[1];

    var decoded = jwt.verify(token, "shhhhh");

    if (!decoded) {
      const error = new Error("Not authenticated");
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
