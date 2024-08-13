const mongoose = require("mongoose");
const { logger } = require("../../../utils/logger");

const schema = new mongoose.Schema({
  name: String,
  products: [
    {
      id: Number,
      name: String,
      price: Number,
    },
  ],
});

schema.pre("save", function (next) {
  if (this.isNew) {
    logger.info(`New business being created: ${this.name}`);
  } else {
    logger.debug(`Business being updated: ${this.name}`);
  }
  next();
});

schema.statics.findByName = function (name) {
  logger.debug(`Searching for business with name: ${name}`);
  return this.findOne({ name });
};

const Business = mongoose.model("Business", schema, "businesses");

module.exports = Business;
