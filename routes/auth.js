const express = require("express");
const router = express.Router();
const isAuthAdmin = require("../middleware/is-auth-admin");
const { body } = require("express-validator/check");

const authController = require("../controllers/auth");

router.get("/getUsers", isAuthAdmin, authController.getUsers);
router.get("/getUser/:id", isAuthAdmin, authController.getUser);
router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username cannot be empty"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
  ],
  authController.login
);
router.post(
  "/createUser",
  isAuthAdmin,
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
  authController.createUser
);

router.put(
  "/updateUser",
  isAuthAdmin,
  [
    body("id").notEmpty().withMessage("User ID cannot be empty"),
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
  authController.createUser
);

router.delete("/deleteUser/:id", isAuthAdmin, authController.deleteUser);

module.exports = router;
