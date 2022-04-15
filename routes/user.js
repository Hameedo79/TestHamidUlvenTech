const express = require("express");
const router = express.Router();
const User = require("../models/user");
const isAuth = require("../middleware/is-auth");
const isAuthMentor = require("../middleware/is-auth-mentor");
const isAuthAdmin = require("../middleware/is-auth-admin");
const { check, body, param } = require("express-validator/check");

const assessmentController = require("../controllers/assessment");
const submissionController = require("../controllers/submission");

router.get("/getAssessments", isAuthAdmin, assessmentController.getAssessments);
router.get(
  "/getAssessment/:id",
  isAuthAdmin,
  assessmentController.getAssessment
);
router.post(
  "/addNewAssessment",
  isAuthAdmin,
  [
    body("title")
      .notEmpty()
      .withMessage("Title cannot be empty")
      .matches(/^[A-Za-z0-9 ]+$/)
      .withMessage("Title can only contain alphanumeric"),
    body("description")
      .optional({ checkFalsy: true })
      .matches(/^[A-Za-z0-9 ]+$/)
      .withMessage("Description can only contain alphanumeric")
      .isLength({ max: 100 })
      .withMessage("Description has maximum length of 100 characters"),
    body("deadline").notEmpty().withMessage("Deadline cannot be empty"),
    body("mentor")
      .notEmpty()
      .withMessage("Mentor ID cannot be empty")
      .custom((value, { req }) => {
        if (value <= 0) {
          const error = new Error("Mentor ID has an invalid value");
          error.statusCode = 400;
          return next(error);
        }
        return true;
      }),
  ],
  assessmentController.addNewAssessment
);
router.put(
  "/updateAssessment",
  isAuthAdmin,
  [
    body("id").notEmpty().withMessage("Assessment ID cannot be empty"),
    body("title")
      .notEmpty()
      .withMessage("Title cannot be empty")
      .matches(/^[A-Za-z0-9 ]+$/)
      .withMessage("Title can only contain alphanumeric"),
    body("description")
      .optional({ checkFalsy: true })
      .matches(/^[A-Za-z0-9 ]+$/)
      .withMessage("Description can only contain alphanumeric")
      .isLength({ max: 100 })
      .withMessage("Description has maximum length of 100 characters"),
    body("deadline").notEmpty().withMessage("Deadline cannot be empty"),
    body("mentor")
      .notEmpty()
      .withMessage("Mentor ID cannot be empty")
      .custom((value, { req }) => {
        if (value <= 0) {
          const error = new Error("Mentor ID has an invalid value");
          error.statusCode = 400;
          return next(error);
        }
        return true;
      }),
  ],
  assessmentController.addNewAssessment
);
router.delete(
  "/deleteAssessment/:id",
  isAuthAdmin,
  assessmentController.deleteAssessment
);

router.get("/getSubmissions", isAuth, submissionController.getSubmissions);
router.get("/getSubmission/:id", isAuth, submissionController.getSubmission);
router.post(
  "/addNewSubmission",
  isAuth,
  [
    body("assessmentId").custom(async (value, { req }) => {
      const getRole = await User.findByPk(req.userId);

      if (getRole === null) {
        const error = new Error("Role unidentified");
        error.statusCode = 404;
        return next(error);
      }

      const role = getRole.dataValues.roleId;

      if (role == 1) {
        if (req.body.id === undefined || req.body.id === "") {
          const error = new Error("ID cannot be empty");
          error.statusCode = 400;
          return next(error);
        }
      } else {
        if (value === undefined || value == "") {
          const error = new Error("Assessment ID cannot be empty");
          error.statusCode = 400;
          return next(error);
        }
      }
      return true;
    }),
    body("mark")
      .notEmpty()
      .withMessage("Mark cannot be empty")
      .matches(/^[A-Za-z0-9 ]+$/)
      .withMessage("Mark can only contain alphanumeric"),
  ],
  submissionController.addNewSubmission
);
router.put(
  "/updateSubmission",
  isAuth,
  [
    body("id").notEmpty().withMessage("Submission ID cannot be empty"),
    body("assessmentId").custom(async (value, { req }) => {
      const getRole = await User.findByPk(req.userId);

      if (getRole === null) {
        const error = new Error("Role unidentified");
        error.statusCode = 404;
        return next(error);
      }

      const role = getRole.dataValues.roleId;

      if (role == 1) {
        if (req.body.id === undefined || req.body.id === "") {
          const error = new Error("ID cannot be empty");
          error.statusCode = 400;
          return next(error);
        }
      } else {
        if (value === undefined || value == "") {
          const error = new Error("Assessment ID cannot be empty");
          error.statusCode = 400;
          return next(error);
        }
      }
      return true;
    }),
    body("mark")
      .notEmpty()
      .withMessage("Mark cannot be empty")
      .matches(/^[A-Za-z0-9 ]+$/)
      .withMessage("Mark can only contain alphanumeric"),
  ],
  submissionController.addNewSubmission
);
router.patch(
  "/gradeSubmission",
  isAuthMentor,
  [
    body("id").notEmpty().withMessage("ID cannot be empty"),
    body("mark")
      .notEmpty()
      .withMessage("Mark cannot be empty")
      .matches(/^[A-Za-z0-9 ]+$/)
      .withMessage("Mark can only contain alphanumeric"),
  ],
  submissionController.gradeSubmission
);
router.delete(
  "/deleteSubmission/:id",
  isAuthAdmin,
  submissionController.deleteSubmission
);

module.exports = router;
