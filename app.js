const http = require("http");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const multer = require("multer");
const moment = require("moment");

const express = require("express");
const sequelize = require("./util/database");

const app = express();

const Role = require("./models/role");
const User = require("./models/user");
const Assessment = require("./models/assessment");
const Submission = require("./models/submission");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path2 = "./files";
    const dest = path.join(__dirname, path2, "/");

    fs.access(dest, function (error) {
      if (error) {
        fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
      } else {
        cb(null, dest);
      }
    });
  },

  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/ /g, "_");
    const newFileName =
      moment(Date.now()).format("YYYY_MM_DD_HH_MM_SS") + "_" + fileName;
    cb(null, newFileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/msword" ||
    file.mimetype === "application/pdf" ||
    file.mimetype == "application/octet-stream"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json({ limit: "50mb" }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).any());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules")));
app.use(express.static(path.join(__dirname, "/")));

app.use(userRoute);
app.use(authRoute);

app.use((error, req, res, next) => {
  return res
    .status(error.statusCode)
    .json({ message: error.message, status: "error" });
});

User.belongsTo(Role);

User.hasMany(Submission);
Submission.belongsTo(User, { constrains: true, onDelete: "CASCADE" });

Assessment.hasMany(Submission);
Submission.belongsTo(Assessment, { constraints: true, onDelete: "CASCADE" });
Assessment.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

sequelize
  .sync()
  .then(async (result) => {
    getRole = await Role.findAll();

    if (Object.entries(getRole).length == 0) {
      Role.create({ id: 1, role: "admin" });
      Role.create({ id: 2, role: "mentor" });
      Role.create({ id: 3, role: "student" });
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

    const getMentor = await User.findOne({
      where: {
        roleId: 2,
      },
    });

    if (getMentor === null) {
      const hashedPassword2 = await bcrypt.hash("mentor", 12);
      User.create({
        id: 2,
        name: "mentor",
        username: "mentor",
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
