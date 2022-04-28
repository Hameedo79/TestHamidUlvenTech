const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator/check");

const adminController = require("../controllers/admin");
const customerController = require("../controllers/customer");

router.get("/helloWorldAdmin", isAuth, adminController.helloWorldAdmin);
router.get("/getAdmins", isAuth, adminController.getAdmins);
router.get("/getAdmin/:id", isAuth, adminController.getAdmin);
router.post(
  "/addNewAdmin",
  isAuth,
  [
    body("name").notEmpty().withMessage("Name cannot be empty"),
    body("username").notEmpty().withMessage("Username cannot be empty"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
  ],
  adminController.addNewAdmin
);
router.put(
  "/updateAdmin",
  isAuth,
  [
    body("name").notEmpty().withMessage("Name cannot be empty"),
    body("username").notEmpty().withMessage("Username cannot be empty"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
  ],
  adminController.updateAdmin
);
router.delete("/deleteAdmin/:id", isAuth, adminController.deleteAdmin);

router.get(
  "/helloWorldCustomer",
  isAuth,
  customerController.helloWorldCustomer
);
router.get("/getCustomers", isAuth, customerController.getCustomers);
router.get("/getCustomer/:id", isAuth, customerController.getCustomer);
router.post(
  "/addNewCustomer",
  isAuth,
  [
    body("name").notEmpty().withMessage("Name cannot be empty"),
    body("username").notEmpty().withMessage("Username cannot be empty"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
  ],
  customerController.addNewCustomer
);
router.put(
  "/updateCustomer",
  isAuth,
  [
    body("name").notEmpty().withMessage("Name cannot be empty"),
    body("username").notEmpty().withMessage("Username cannot be empty"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
  ],
  customerController.updateCustomer
);
router.delete("/deleteCustomer/:id", isAuth, customerController.deleteCustomer);

module.exports = router;
