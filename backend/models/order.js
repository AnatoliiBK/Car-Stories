const mongoose = require("mongoose");

require("dotenv").config();

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      // required: true,
    },
    customerId: { type: String },
    paymentIntentId: { type: String },
    products: [],
    subTotal: {
      type: Number,
      // required: true,
    },
    total: { type: Number, required: true },
    shipping: { type: Object, required: true },
    delivery_status: { type: String, default: "pending" },
    payment_status: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

// {
//   id: { type: String },
//   name: { type: String },
//   brand: { type: String },
//   desc: { type: String },
//   price: { type: String },
//   image: { type: String },
//   cartQuantity: { type: Number },
// },
