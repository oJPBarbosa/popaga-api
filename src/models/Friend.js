const { Model, DataTypes } = require('sequelize');

class Friend extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      user_id: DataTypes.INTEGER,
      friend_id: DataTypes.INTEGER
    }, {
      sequelize
    });
  }
}

module.exports = Friend;