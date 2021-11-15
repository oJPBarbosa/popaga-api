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
    /* this.belongsToMany(models.User, {
      foreignKey: 'group_id',
      through: 'user_groups',
      as: 'group',
    }); */
    /* this.belongsTo(models.UserGroup, {
      foreignKey: 'group_id',
      as: 'groups',
    }); */
  }
}

module.exports = Group;
