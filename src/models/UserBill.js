const { Model, DataTypes } = require('sequelize');

class UserBill extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        bill_id: DataTypes.UUID,
        user_id: DataTypes.UUID,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Bill, { foreignKey: 'bill_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'data' });
  }
}

module.exports = UserBill;
