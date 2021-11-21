const { Model, DataTypes } = require('sequelize');

class Bill extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        value: DataTypes.STRING,
        status: DataTypes.STRING,
        owner_id: DataTypes.UUID,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });
    this.hasMany(models.UserBill, {
      foreignKey: 'bill_id',
      as: 'users',
    });
  }
}

module.exports = Bill;
