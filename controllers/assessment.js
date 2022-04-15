const Assessment = require("../models/assessment");
const User = require("../models/user");
const moment = require("moment");
const { validationResult } = require("express-validator/check");

exports.getAssessments = async (req, res, next) => {
  try {
    console.log('jaja');
    const data = await Assessment.findAll();

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

exports.getAssessment = async (req, res, next) => {
  try {
    const id = req.params.id;

    const data = await Assessment.findByPk(id);

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

exports.addNewAssessment = async (req, res, next) => {
  let id = req.body.id;
  const title = req.body.title;
  const description = req.body.description;
  const mentor = req.body.mentor;
  const deadline = moment(req.body.deadline).format("YYYY-MM-DD");
  let message = "";

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
    const getMentor = await User.findOne({
      where: {
        id: mentor,
        roleId: 2,
      },
    });

    if (getMentor === null) {
      const error = new Error("Mentor not found");
      error.statusCode = 404;
      return next(error);
    }
    const data = {
      title: title,
      description: description,
      userId: mentor,
      deadline: deadline,
    };

    if (id) {
      const getAssesment = await Assessment.findByPk(id);

      if (getAssesment === null) {
        const error = new Error("Assessment not found");
        error.statusCode = 404;
        return next(error);
      }

      await Assessment.update(data, { where: { id: id } });
      message = "Successfully updated assessment";
    } else {
      await Assessment.create(data);
      message = "Successfully created a new assessment";
    }

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

exports.deleteAssessment = async (req, res, next) => {
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
    const getAssesment = await Assessment.findByPk(id);

    if (getAssesment === null) {
      const error = new Error("Assessment not found");
      error.statusCode = 404;
      return next(error);
    }

    await Assessment.destroy({ where: { id: id } });

    res
      .status(200)
      .json({ message: "Successfully deleted assessment", status: "success" });
  } catch (err) {
    console.log(err);

    const error = new Error(
      "Something went wrong. Please contact the administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};
