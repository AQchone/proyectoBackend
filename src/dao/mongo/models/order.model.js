const mongoose = require("mongoose");
const { logger } = require("../../../utils/logger");

const schema = new mongoose.Schema({
  number: Number,
  products: [],
  totalPrice: Number,
  status: String,
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

schema.pre("save", function (next) {
  if (this.isNew) {
    logger.info(`New order being created: Order #${this.number}`);
  } else {
    logger.debug(`Order being updated: Order #${this.number}`);
  }
  next();
});

schema.post("save", function (doc) {
  logger.info(
    `Order saved successfully: Order #${doc.number}, Status: ${doc.status}`
  );
});

schema.methods.updateStatus = function (newStatus) {
  logger.debug(`Updating status of Order #${this.number} to ${newStatus}`);
  this.status = newStatus;
  return this.save();
};

const Order = mongoose.model("Order", schema, "orders");

module.exports = Order;
