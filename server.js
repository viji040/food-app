console.log("SERVER FILE RUNNING...");

require("dotenv").config();

console.log("ENV VALUE:", process.env.MONGO_URI);
console.log("TYPE:", typeof process.env.MONGO_URI);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Food = require("./models/Food");

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

// mongoose.connect("mongodb://viji_04:viji2468db@ac-4n5kwsp-shard-00-00.ztryfav.mongodb.net:27017,ac-4n5kwsp-shard-00-01.ztryfav.mongodb.net:27017,ac-4n5kwsp-shard-00-02.ztryfav.mongodb.net:27017/?ssl=true&replicaSet=atlas-51d9nt-shard-0&authSource=admin&appName=Cluster0")
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

const User = require("./models/User");

// REGISTER
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const user = new User({ username, password });
  await user.save();

  res.json("User registered");
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

