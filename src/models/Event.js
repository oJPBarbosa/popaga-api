const { Model, DataTypes } = require('sequelize');

class Event extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        name: DataTypes.STRING,
        status: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.EventBill, {
      foreignKey: 'event_id',
      as: 'bills',
    });
    this.hasMany(models.EventUser, {
      foreignKey: 'event_id',
      as: 'users',
    });
  }
}

module.exports = Event;
