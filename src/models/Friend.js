const { Model, DataTypes } = require('sequelize');

class Friend extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        user_id: DataTypes.STRING,
        friend_id: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'friend_id', as: 'friend' });
  }
}

module.exports = Friend;
