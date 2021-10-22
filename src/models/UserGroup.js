const { Model, DataTypes } = require('sequelize');

class UserGroup extends Model {
  static init(sequelize) {
    super.init({
      group_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER
    }, {
      sequelize
    });
  }
}

module.exports = UserGroup;