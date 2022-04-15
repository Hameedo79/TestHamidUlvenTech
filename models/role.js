const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Role = sequelize.define("role", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  active: {
    type: Sequelize.INTEGER,
    defaultValue:1
  }
  
});

module.exports = Role;
