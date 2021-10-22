const { Model, DataTypes } = require('sequelize');

class Group extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      state: DataTypes.STRING
    }, {
      sequelize
    });
  }
}

module.exports = Group;