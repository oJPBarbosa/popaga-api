const { Model, DataTypes } = require('sequelize');

class UserGroup extends Model {
  static init(sequelize) {
    super.init(
      {
        group_id: DataTypes.UUID,
        user_id: DataTypes.UUID,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Group, { foreignKey: 'group_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'data' });
  }
}

module.exports = UserGroup;
