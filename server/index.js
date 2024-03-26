const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userInfosModel = require("./models/cryptfolio");
const Investment = require("./models/investments");
const session = require("express-session");
const {
  Types: { ObjectId },
} = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "1111AKIRA",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
mongoose.connect("mongodb://127.0.0.1:27017/cryptfolio");
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  userInfosModel.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        req.session.userId = user._id; // Store user ID in session
        console.log("User ID:", req.session.userId);
        res.json("Success");
      } else {
        res.json("the password is incorrect");
      }
    } else {
      res.json("No record existed");
    }
  });
});

app.post("/register", (req, res) => {
  userInfosModel
    .create(req.body)
    .then((user_infos) => res.json(user_infos))
    .catch((err) => res.json(err));
});

app.post("/investement", async (req, res) => {
  try {
    const { coin, amount, price } = req.body;

    // Check if all required fields are provided
    if (!coin || !amount || !price) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }
    const sessionUserId = new ObjectId(req.session.userId);

    // Check if userId exists in session
    if (!sessionUserId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    console.log("user ID:", sessionUserId);
    // Create a new investment record
    const investment = await Investment.create({
      userId: sessionUserId,
      coin,
      amount,
      price,
      status: "Holding", // Default status for a new investment
    });

    res.status(201).json({ ...investment._doc, id: investment._id });
  } catch (error) {
    console.error("Error creating investment:", error);
    res.status(500).json({ error: "Internal server error Investement" });
  }
});
app.get("/investement", async (req, res) => {
  try {
    const investments = await Investment.find();
    res.status(200).json(investments);
  } catch (error) {
    console.error("Error fetching investments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(3001, () => {
  console.log("Server is running");
});
