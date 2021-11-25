const Sequelize = require('sequelize');

const Bill = require('../models/Bill');
const Event = require('../models/Event');
const EventBill = require('../models/EventBill');
const EventUser = require('../models/EventUser');
const User = require('../models/User');

const config = require('../config/database');

const models = [Bill, Event, EventBill, EventUser, User];

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
