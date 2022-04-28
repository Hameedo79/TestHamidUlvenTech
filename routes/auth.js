const express = require("express");
const router = express.Router();
const { body } = require("express-validator/check");

const authController = require("../controllers/auth");

router.post(
  "/signUp",
  [
    body("name").notEmpty().withMessage("Name cannot be empty"),
    body("username").notEmpty().withMessage("Username cannot be empty"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
    body("role")
      .notEmpty()
      .withMessage("Role cannot be empty")
      .custom((value, { req }) => {
        if (value <= 0 || value > 3) {
          const error = new Error("Role has an invalid value");
          error.statusCode = 400;
          return next(error);
        }
        return true;
      }),
  ],
  authController.signUp
);

router.post(
  "/signIn",
  [
    body("username").notEmpty().withMessage("Username cannot be empty"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
  ],
  authController.signIn
);

module.exports = router;
