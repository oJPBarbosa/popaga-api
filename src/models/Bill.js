const { Model, DataTypes } = require('sequelize');

class Bill extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        value: DataTypes.STRING,
        state: DataTypes.STRING,
        group_id: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Group, { foreignKey: 'group_id', as: 'group' });
  }
}

module.exports = Bill;
