var DataTypes = require("sequelize").DataTypes;
var _customer = require("./customer");
var _driver = require("./driver");
var _review = require("./review");
var _ride = require("./ride");

function initModels(sequelize) {
  var customer = _customer(sequelize, DataTypes);
  var driver = _driver(sequelize, DataTypes);
  var review = _review(sequelize, DataTypes);
  var ride = _ride(sequelize, DataTypes);

  ride.belongsTo(customer, { as: "customer", foreignKey: "customer_id"});
  customer.hasMany(ride, { as: "rides", foreignKey: "customer_id"});
  review.belongsTo(driver, { as: "driver", foreignKey: "driver_id"});
  driver.hasMany(review, { as: "reviews", foreignKey: "driver_id"});
  ride.belongsTo(driver, { as: "driver", foreignKey: "driver_id"});
  driver.hasMany(ride, { as: "rides", foreignKey: "driver_id"});

  return {
    customer,
    driver,
    review,
    ride,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
