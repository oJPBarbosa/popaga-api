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
    this.hasMany(models.Group, { foreignKey: 'owner_id' });
    this.hasMany(models.UserGroup, {
      foreignKey: 'user_id',
      as: 'groups',
    });
  }
}

module.exports = User;
