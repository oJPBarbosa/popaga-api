const { Model, DataTypes } = require('sequelize');

class UserGroup extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        group_id: DataTypes.STRING,
        user_id: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Group, { foreignKey: 'group_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

module.exports = UserGroup;
