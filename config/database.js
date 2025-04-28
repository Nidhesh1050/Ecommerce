// sequelize.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('your_db', 'your_user', 'your_password', {
  host: 'localhost',
  dialect: 'mysql' // or 'postgres', 'sqlite', etc.
});

module.exports = sequelize;
