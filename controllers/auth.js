const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator/check");

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let messages = "";
    for (var i = 0; i < errors.array().length; i++) {
      messages = messages + "" + errors.array()[i].msg;

      if (parseInt(errors.array().length) - parseInt(i) !== 1) {
        messages = messages + ", ";
      }
    }
    const error = new Error(messages);
    error.statusCode = 422;
    return next(error);
  }

  let id = req.body.id;
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const data = {
      name: name,
      username: username,
      password: hashedPassword,
      roleId: role,
    };

    const checkUsername = await User.findOne({
      where: {
        username: username,
      },
    });

    if (checkUsername) {
      const error = new Error("Username already exists");
      error.statusCode = 401;
      return next(error);
    }

    await User.create(data);
    message = "Successfully signed up";

    res.status(201).json({ message: message, status: "success" });
  } catch (err) {
    console.log(err);

    const error = new Error(
      "Something went wrong. Please contact the administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};

exports.signIn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let messages = "";
    for (var i = 0; i < errors.array().length; i++) {
      messages = messages + "" + errors.array()[i].msg;

      if (parseInt(errors.array().length) - parseInt(i) !== 1) {
        messages = messages + ", ";
      }
    }
    const error = new Error(messages);
    error.statusCode = 422;
    return next(error);
  }

  const username = req.body.username;
  const password = req.body.password;

  try {
    const getUser = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!getUser) {
      const error = new Error("Invalid Credentials");
      error.statusCode = 401;
      return next(error);
    }

    const checkPassword = bcrypt.compareSync(
      password,
      getUser.dataValues.password
    );

    if (!checkPassword) {
      const error = new Error("Invalid Credentials");
      error.statusCode = 401;
      return next(error);
    }

    const payload = {
      userId: getUser.dataValues.id,
      username: getUser.dataValues.username,
      iat: 1516234022,
    };

    var token = jwt.sign(payload, "shhhhh");

    return res.status(200).json({ status: "success", token: token });
  } catch (err) {
    console.log(err);

    const error = new Error(
      "Something went wrong. Please contact the administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};
