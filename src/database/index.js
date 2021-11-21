const Sequelize = require('sequelize');

const Bill = require('../models/Bill');
const User = require('../models/User');
const UserBill = require('../models/UserBill');

const config = require('../config/database');

const models = [Bill, User, UserBill];

class DataBase {
  constructor() {
    this.init();
  }

  init() {
    const connection = new Sequelize(config);

    models.map((model) => model.init(connection));
    models.map((model) => model.associate(connection.models));
  }
}

module.exports = new DataBase();
