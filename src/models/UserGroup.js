const { Model, DataTypes } = require('sequelize');

class UserGroup extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      group_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER
    }, {
      sequelize
    });
  }
}

module.exports = UserGroup;