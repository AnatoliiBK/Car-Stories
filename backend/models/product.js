const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Object, required: true },
    fullDesc: {
      display: { type: String },
      processor: { type: String },
      memory: { type: String },
      camera: { type: String },
      battery: { type: String },
      weight: { type: String },
      os: { type: String },
      advantages: { type: [String] },
      disadvantages: { type: [String] },
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

// в utils створюємо cloudinary.js
