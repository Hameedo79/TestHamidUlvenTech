const Assessment = require("../models/assessment");
const Submission = require("../models/submission");
const User = require("../models/user");
const sequelize = require("../util/database");
const { QueryTypes } = require("sequelize");
const moment = require("moment");
const { validationResult } = require("express-validator/check");

exports.getSubmissions = async (req, res, next) => {
  const userId = req.userId;

  const getRole = await User.findByPk(userId);

  if (getRole === null) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    return next(error);
  }

  try {
    let data;
    const role = getRole.dataValues.roleId;

    if (role == 1) {
      data = await Submission.findAll();
    } else if (role == 2) {
      data = await sequelize.query(
        `select * from submissions where assessmentId = (select id from assessments where userId = ${req.userId})`,
        { type: QueryTypes.SELECT }
      );

      return res.status(200).json({ data: data, status: `success` });
    } else {
      data = await Submission.findAll({
        where: {
          userId: userId,
        },
      });
    }

    if (Object.entries(data).length != 0) {
      const arr = [];
      for (const i in data) {
        arr.push(data[i].dataValues);
      }

      return res.status(200).json({ data: arr, status: `success ${userId}` });
    } else {
      const error = new Error("Data not found");
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    console.log(err);

    const error = new Error(
      "Something went wrong. Please contact the Administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};

exports.getSubmission = async (req, res, next) => {
  const userId = req.userId;
  const id = req.params.id;

  const getRole = await User.findByPk(userId);

  if (getRole === null) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    return next(error);
  }

  try {
    let data;
    const role = getRole.dataValues.roleId;

    if (role == 1) {
      data = await Submission.findByPk(id);
    } else if (role == 2) {
      data = await sequelize.query(
        `select * from submissions where id = ${id} and assessmentId = (select id from assessments where userId = ${req.userId})`,
        { type: QueryTypes.SELECT }
      );

      return res.status(200).json({ data: data, status: `success` });
    } else {
      data = await Submission.findOne({
        where: {
          userId: userId,
          id: id,
        },
      });
    }

    if (data) {
      return res
        .status(200)
        .json({ data: data.dataValues, status: `success ${userId}` });
    } else {
      const error = new Error("Data not found");
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    console.log(err);

    const error = new Error(
      "Something went wrong. Please contact the Administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};

exports.addNewSubmission = async (req, res, next) => {
  let id = req.body.id;
  const assessmentId = req.body.assessmentId;
  const mark = req.body.mark;
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
    const data = {
      assessmentId: assessmentId,
      mark: mark,
    };

    if (Array.isArray(req.files) && req.files.length !== 0) {
      data["fileType"] = req.files[0].mimetype;
      data["fileName"] = req.files[0].filename;
      data["filePath"] = req.files[0].path;
      data["originalFileName"] = req.files[0].originalname;
    }

    if (id) {
      const getRole = await User.findByPk(req.userId);

      if (getRole === null) {
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        return next(error);
      }

      const role = getRole.dataValues.roleId;

      if (role != 1) {
        const error = new Error("You are not authorized to access this data");
        error.statusCode = 401;
        return next(error);
      }

      const getSubmission = await Submission.findByPk(id);

      if (getSubmission === null) {
        const error = new Error("Submission not found");
        error.statusCode = 404;
        return next(error);
      }

      await Submission.update(data, { where: { id: id } });
      message = "Successfully updated submission";
    } else {
      data["userId"] = req.userId;
      const getAssessment = await Assessment.findOne({
        where: {
          id: assessmentId,
        },
      });

      if (getAssessment === null) {
        const error = new Error("Assessment not found");
        error.statusCode = 404;
        return next(error);
      }

      await Submission.create(data);
      message = "Successfully created a new submission";
    }

    res.status(201).json({ message: message, status: "success" });
  } catch (err) {
    console.log(err);

    const error = new Error(
      "Something went wrong. Please contact the Administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};

exports.deleteSubmission = async (req, res, next) => {
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
    const getSubmission = await Submission.findByPk(id);

    if (getSubmission === null) {
      const error = new Error("Submission not found");
      error.statusCode = 404;
      return next(error);
    }

    await Submission.destroy({ where: { id: id } });

    res
      .status(200)
      .json({ message: "Successfully deleted submission", status: "success" });
  } catch (err) {
    console.log(err);

    const error = new Error(
      "Something went wrong. Please contact the Administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};

exports.gradeSubmission = async (req, res, next) => {
  const id = req.body.id;
  const mark = req.body.mark;

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
    const getSubmission = await Submission.findByPk(id);

    if (getSubmission === null) {
      const error = new Error("Submission not found");
      error.statusCode = 404;
      return next(error);
    }

    const getAssessment = await Assessment.findByPk(
      getSubmission.dataValues.assessmentId
    );

    if (getAssessment === null) {
      const error = new Error("Assessment not found");
      error.statusCode = 404;
      return next(error);
    }

    if (getAssessment.dataValues.userId != req.userId) {
      const error = new Error("You are not authorized to access this data");
      error.statusCode = 401;
      return next(error);
    }
    await Submission.update({ mentorMark: mark }, { where: { id: id } });

    return res.status(201).json({
      message: "Successfully give grade to submission",
      status: "success",
    });
  } catch (err) {
    console.log(err);

    const error = new Error(
      "Something went wrong. Please contact the Administrator"
    );
    error.statusCode = 500;
    return next(error);
  }
};
