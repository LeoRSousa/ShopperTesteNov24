const db = require('../database.js');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const ReviewDB = db.define('review', {
  review_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  rating: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  comment: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  driver_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'driver',
      key: 'driver_id'
    }
  }
}, {
  Sequelize,
  tableName: 'review',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "review_pkey",
      unique: true,
      fields: [
        { name: "review_id" },
      ]
    },
  ]
});

ReviewDB.sync({ force: false });

module.exports = ReviewDB;