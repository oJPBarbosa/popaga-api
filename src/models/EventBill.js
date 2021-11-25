const { Model, DataTypes } = require('sequelize');

class EventBill extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        event_id: DataTypes.UUID,
        bill_id: DataTypes.UUID,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Event, { foreignKey: 'event_id' });
    this.belongsTo(models.Bill, { foreignKey: 'bill_id', as: 'data' });
  }
}

module.exports = EventBill;
