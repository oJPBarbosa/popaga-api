const Sequelize = require('sequelize');

const Bill = require('../models/Bill');
const Friend = require('../models/Friend');
const Group = require('../models/Group');
const User = require('../models/User');
const UserGroup = require('../models/UserGroup');

const config = require('../config/database');

const models = [Bill, Friend, Group, User, UserGroup];

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
