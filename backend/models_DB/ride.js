const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ride', {
    ride_id: {
      autoincrement: true,
      type: DataTypes.BIGINT,
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
      type: DataTypes.DECIMAL,
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
    sequelize,
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
};
