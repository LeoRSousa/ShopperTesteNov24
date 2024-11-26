const db = require('../database.js');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const DriverDB = db.define('driver', {
  driver_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  vehicle: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  km: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
}, {
  Sequelize,
  tableName: 'driver',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "driver_pkey",
      unique: true,
      fields: [
        { name: "driver_id" },
      ]
    },
  ]
});

DriverDB.sync({ force: false });

module.exports = DriverDB;