const mongoose = require("mongoose");

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

module.exports = mongoose.model("Business", schema, "businesses");
