const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  sizeType: { type: String, enum: ["standard", "custom"], required: true },
  standardSize: {
    type: String,
    enum: ["Single", "Double", "Queen", "King"],
    required: function () { return this.sizeType === "standard"; }
  },
  customSize: {
    length: { type: Number },
    width: { type: Number },
    required: function () { return this.sizeType === "custom"; }
  },
  clothType: { type: String, required: true },
  cottonType: { type: String, required: true },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
