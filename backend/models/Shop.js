const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: { 
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  description: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Added products array
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Shop", ShopSchema);

