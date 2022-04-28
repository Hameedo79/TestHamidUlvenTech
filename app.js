const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const express = require("express");
const sequelize = require("./util/database");

const app = express();

const Role = require("./models/role");
const User = require("./models/user");

const mainRoute = require("./routes/main");
const authRoute = require("./routes/auth");

app.use(bodyParser.json({ limit: "50mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(mainRoute);
app.use(authRoute);

app.use((error, req, res, next) => {
  return res
    .status(error.statusCode)
    .json({ message: error.message, status: "error" });
});

User.belongsTo(Role);

sequelize
  .sync()
  .then(async (result) => {
    getRole = await Role.findAll();

    if (Object.entries(getRole).length == 0) {
      Role.create({ id: 1, role: "admin" });
      Role.create({ id: 2, role: "customer" });
    }

    return User.findByPk(1);
  })
  .then(async (user) => {
    const hashedPassword = await bcrypt.hash("admin", 12);
    if (!user) {
      return User.create({
        name: "admin",
        username: "admin",
        password: hashedPassword,
        roleId: 1,
      });
    }

    const getCustomer = await User.findOne({
      where: {
        roleId: 2,
      },
    });

    if (getCustomer === null) {
      const hashedPassword2 = await bcrypt.hash("customer", 12);
      User.create({
        id: 2,
        name: "customer",
        username: "customer",
        password: hashedPassword2,
        roleId: 2,
      });
    }

    return user;
  })
  .then((user) => {
    http.createServer(app).listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
