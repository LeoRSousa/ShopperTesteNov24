const db = require('../database.js');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const CustomerDB = db.define('customer', {
  customer_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(250),
    allowNull: false
  }
}, {
  Sequelize,
  tableName: 'customer',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "customer_pkey",
      unique: true,
      fields: [
        { name: "customer_id" },
      ]
    },
  ]
});

CustomerDB.sync({ force: false });

module.exports = CustomerDB;
