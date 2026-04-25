console.log("SERVER FILE RUNNING...");

require("dotenv").config();

console.log("ENV VALUE:", process.env.MONGO_URI);
console.log("TYPE:", typeof process.env.MONGO_URI);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Food = require("./models/Food");
const User = require("./models/User");
const Cart = require("./models/Cart");
const Feedback = require("./models/Feedback");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/images",express.static("images"));


app.post("/addfood", async (req, res) => {
  try {
    console.log("DATA RECEIVED:", req.body);

    const newFood = new Food(req.body);
    await newFood.save();

    res.json({ message: "Food Added Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


app.get("/foods", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});



app.delete("/food/:id", async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);

    if (!deletedFood) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.json({ message: "Food deleted", deletedFood });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

console.log("ENV VALUE:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Food Marketplace Server is Running!');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({
        success: false,
        message: "Username already exists"
      });
    }

    const user = new User({ username, password });
    await user.save();

    res.json({
      success: true,
      message: "User registered successfully "
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error "
    });
  }
});


app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (user) {
      res.json({ success: true, username: user.username });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/addcart", async (req, res) => {
  try {
    const { username, foodName, price, image } = req.body;

    // check if already in cart
    const existingItem = await Cart.findOne({
      username,
      foodName
    });

    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();

      return res.json({
        success: true,
        message: "Quantity increased "
      });
    }

    const newCartItem = new Cart({
      username,
      foodName,
      price,
      image,
      quantity: 1
    });

    await newCartItem.save();

    res.json({
      success: true,
      message: "Added to cart "
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.get("/cart/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const cartItems = await Cart.find({ username });

    res.json(cartItems);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error fetching cart "
    });
  }
});

app.delete("/cart/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Item removed "
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Delete failed "
    });
  }
});


app.put("/cart/:id", async (req, res) => {
  try {
    const { action } = req.body;

    const item = await Cart.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found"
      });
    }

    if (action === "plus") {
      item.quantity += 1;
    }

    if (action === "minus") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        await Cart.findByIdAndDelete(req.params.id);

        return res.json({
          success: true,
          message: "Item removed"
        });
      }
    }

    await item.save();

    res.json({
      success: true,
      message: "Quantity updated"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
});

// ADD FEEDBACK
app.post("/addfeedback", async (req, res) => {
  try {
    const { username, message, rating } = req.body;

    const newFeedback = new Feedback({
      username,
      message,
      rating
    });

    await newFeedback.save();

    res.json({
      success: true,
      message: "Feedback added successfully"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Feedback failed"
    });
  }
});


// GET ALL FEEDBACKS
app.get("/feedbacks", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    res.json(feedbacks);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error fetching feedbacks"
    });
  }
});

app.delete("/feedback/:id", async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Feedback deleted"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
});