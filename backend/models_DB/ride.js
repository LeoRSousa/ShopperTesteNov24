const db = require('../database.js');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const RideDB = db.define('ride', {
  ride_id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  origin: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  destination: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  distance: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  driver_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'driver',
      key: 'driver_id'
    }
  },
  customer_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'customer',
      key: 'customer_id'
    }
  }
}, {
  Sequelize,
  tableName: 'ride',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "ride_pkey",
      unique: true,
      fields: [
        { name: "ride_id" },
      ]
    },
  ]
});

RideDB.sync({ force: false });

module.exports = RideDB;
