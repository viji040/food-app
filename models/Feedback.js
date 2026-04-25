const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  username: String,
  message: String,
  rating: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Feedback", FeedbackSchema);