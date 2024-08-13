const mongoose = require("mongoose");
const { logger } = require("../../../utils/logger");

const schema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

schema.pre("save", function (next) {
  if (this.isNew) {
    logger.info(`New user being created: ${this.name} (${this.email})`);
  } else {
    logger.debug(`User being updated: ${this.name} (${this.email})`);
  }
  next();
});

schema.statics.findByRole = function (role) {
  logger.debug(`Searching for users with role: ${role}`);
  return this.find({ role });
};

schema.methods.addOrder = function (orderId) {
  logger.debug(`Adding order ${orderId} to user ${this.name}`);
  this.orders.push(orderId);
  return this.save();
};

const User = mongoose.model("User", schema, "users");

module.exports = User;
