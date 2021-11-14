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
    this.hasMany(models.Group, { foreignKey: 'owner_id' });
    /* this.belongsToMany(models.Group, {
      foreignKey: 'user_id',
      through: 'user_groups',
      as: 'user',
    }); */
    this.belongsTo(models.UserGroup, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

module.exports = User;
