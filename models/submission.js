const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Submission = sequelize.define("submission", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  fileType: Sequelize.STRING,
  fileName: Sequelize.STRING,
  filePath: Sequelize.STRING,
  originalFileName: Sequelize.STRING,
  grades: Sequelize.INTEGER,
  mark: Sequelize.STRING,
  mentorMark: Sequelize.STRING,
});

module.exports = Submission;
