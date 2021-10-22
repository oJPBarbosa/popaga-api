const Sequelize = require('sequelize');
const config = require('../config/database');

const Bill = require('../models/Bill');
const Friend = require('../models/Friend');
const Group = require('../models/Group');
const User = require('../models/User');
const UserGroup = require('../models/UserGroup');

const connection = new Sequelize(config);

Bill.init(connection);
Friend.init(connection);
Group.init(connection);
User.init(connection);
UserGroup.init(connection);

module.exports = connection;