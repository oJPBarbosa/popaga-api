const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      username: DataTypes.STRING,
      avatar: DataTypes.STRING,
    }, {
      sequelize
    });
  }
}

module.exports = User;