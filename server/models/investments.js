const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
//Schema for Investments
const investmentSchema = new mongoose.Schema({
  userId: { type: ObjectId, required: true },
  coin: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  dateInvestment: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Holding", "Closed"],
    required: true,
  },
});

module.exports = mongoose.model("investments", investmentSchema);
