const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Assessment = sequelize.define("assessment", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: Sequelize.STRING,
  deadline: Sequelize.DATE,
});

module.exports = Assessment;
