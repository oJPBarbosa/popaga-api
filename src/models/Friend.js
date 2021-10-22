const { Model, DataTypes } = require('sequelize');

class Friend extends Model {
  static init(sequelize) {
    super.init({
      user_id: DataTypes.INTEGER,
      friend_id: DataTypes.INTEGER
    }, {
      sequelize
    });
  }
}

module.exports = Friend;