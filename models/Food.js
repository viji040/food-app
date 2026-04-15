const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  veg: Boolean,
  rating: Number,
  quantity: Number
});

module.exports = mongoose.model("Food", FoodSchema);