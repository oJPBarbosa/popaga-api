const { Model, DataTypes } = require('sequelize');

class EventUser extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        event_id: DataTypes.UUID,
        user_id: DataTypes.UUID,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Event, { foreignKey: 'event_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'data' });
  }
}

module.exports = EventUser;
