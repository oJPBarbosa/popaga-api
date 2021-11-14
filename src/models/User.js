const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        username: DataTypes.STRING,
        avatar: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Friend, { foreignKey: 'user_id' });
    this.hasMany(models.Friend, { foreignKey: 'friend_id' });
    this.hasMany(models.UserGroup, { foreignKey: 'user_id' });
  }
}

module.exports = User;
