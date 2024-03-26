const mongoose = require("mongoose");

// Schema for user information
const userInfosSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Model for user information
const userInfosModel = mongoose.model("user_infos", userInfosSchema);

module.exports = userInfosModel;
