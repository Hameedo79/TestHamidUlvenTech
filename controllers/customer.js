const User = require("../models/user");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { validationResult } = require("express-validator/check");

exports.helloWorldCustomer = async (req, res, next) => {
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

exports.getCustomers = async (req, res, next) => {
  try {
    const data = await User.findAll({
      where: {
        roleId: 2,
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

exports.getCustomer = async (req, res, next) => {
  try {
    const id = req.params.id;

    const data = await User.findOne({
      where: {
        roleId: 2,
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

exports.addNewCustomer = async (req, res, next) => {
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
      roleId: 2,
    };

    await User.create(data);

    res.status(201).json({
      message: "Successfully created a new customer",
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

exports.updateCustomer = async (req, res, next) => {
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
    const getCustomer = await User.findOne({
      where: {
        roleId: 2,
        id: id,
      },
    });

    if (getCustomer === null) {
      const error = new Error("Customer not found");
      error.statusCode = 404;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const data = {
      name: name,
      username: username,
      password: hashedPassword,
      roleId: 2,
    };

    await User.update(data, { where: { id: id } });

    res
      .status(201)
      .json({ message: "Successfully updated customer", status: "success" });
  } catch (err) {
    console.log(err);

    const error = new Error(
      "Something went wrong. Please contact the administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};

exports.deleteCustomer = async (req, res, next) => {
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
    const getCustomer = await User.findOne({
      where: {
        roleId: 2,
        id: id,
      },
    });

    if (getCustomer === null) {
      const error = new Error("Customer not found");
      error.statusCode = 404;
      return next(error);
    }

    await User.destroy({ where: { id: id } });

    res
      .status(200)
      .json({ message: "Successfully deleted customer", status: "success" });
  } catch (err) {
    console.log(err);

    const error = new Error(
      "Something went wrong. Please contact the administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};
