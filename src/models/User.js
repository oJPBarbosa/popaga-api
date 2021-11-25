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
        avatar: DataTypes.BLOB,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Bill, { foreignKey: 'owner_id' });
    this.hasMany(models.EventUser, {
      foreignKey: 'user_id',
      as: 'events',
    });
  }
}

module.exports = User;
