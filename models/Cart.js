const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  username: String,
  foodName: String,
  price: Number,
  image: String,
  quantity: Number
});

module.exports = mongoose.model("Cart", CartSchema);