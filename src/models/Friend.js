const { Model, DataTypes } = require('sequelize');

class Friend extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        user_id: DataTypes.UUID,
        friend_id: DataTypes.UUID,
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
