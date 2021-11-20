const { Model, DataTypes } = require('sequelize');

class Group extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        name: DataTypes.STRING,
        status: DataTypes.STRING,
        owner_id: DataTypes.UUID,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Bill, { foreignKey: 'group_id' });
    this.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });
    this.hasMany(models.UserGroup, {
      foreignKey: 'group_id',
      as: 'users',
    });
  }
}

module.exports = Group;
