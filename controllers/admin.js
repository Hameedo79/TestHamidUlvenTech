const User = require("../models/user");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { validationResult } = require("express-validator/check");

exports.helloWorldAdmin = async (req, res, next) => {
  try {
    return res.status(200).json({ data: "Hello World", status: "success" });
  } catch (err) {
    console.log(err);

    const error = new Error(
      "Something went wrong. Please contact the administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};

exports.getAdmins = async (req, res, next) => {
  try {
    const data = await User.findAll({
      where: {
        roleId: 1,
      },
    });

    if (Object.entries(data).length != 0) {
      const arr = [];
      for (const i in data) {
        arr.push(data[i].dataValues);
      }

      return res.status(200).json({ data: arr, status: "success" });
    } else {
      const error = new Error("Data not found");
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    console.log(err);

    const error = new Error(
      "Something went wrong. Please contact the administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};

exports.getAdmin = async (req, res, next) => {
  try {
    const id = req.params.id;

    const data = await User.findOne({
      where: {
        roleId: 1,
        id: id,
      },
    });

    if (data) {
      return res.status(200).json({ data: data.dataValues, status: "success" });
    } else {
      const error = new Error("Data not found");
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    console.log(err);

    const error = new Error(
      "Something went wrong. Please contact the administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};

exports.addNewAdmin = async (req, res, next) => {
  let id = req.body.id;
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

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

  try {
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

    const hashedPassword = await bcrypt.hash(password, 12);

    const data = {
      name: name,
      username: username,
      password: hashedPassword,
      roleId: 1,
    };

    await User.create(data);

    res.status(201).json({
      message: "Successfully created a new admin",
      status: "success",
    });
  } catch (err) {
    console.log(err);

    const error = new Error(
      "Something went wrong. Please contact the administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};

exports.updateAdmin = async (req, res, next) => {
  let id = req.body.id;
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

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

  try {
    const getAdmin = await User.findOne({
      where: {
        roleId: 1,
        id: id,
      },
    });

    if (getAdmin === null) {
      const error = new Error("Admin not found");
      error.statusCode = 404;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const data = {
      name: name,
      username: username,
      password: hashedPassword,
      roleId: 1,
    };

    await User.update(data, { where: { id: id } });

    res
      .status(201)
      .json({ message: "Successfully updated admin", status: "success" });
  } catch (err) {
    console.log(err);

    const error = new Error(
      "Something went wrong. Please contact the administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};

exports.deleteAdmin = async (req, res, next) => {
  const id = req.params.id;

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

  try {
    const getAdmin = await User.findOne({
      where: {
        roleId: 1,
        id: id,
      },
    });

    if (getAdmin === null) {
      const error = new Error("Admin not found");
      error.statusCode = 404;
      return next(error);
    }

    await User.destroy({ where: { id: id } });

    res
      .status(200)
      .json({ message: "Successfully deleted admin", status: "success" });
  } catch (err) {
    console.log(err);

    const error = new Error(
      "Something went wrong. Please contact the administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};
