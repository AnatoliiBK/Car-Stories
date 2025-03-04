const mongoose = require("mongoose");

const viewedCarSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    viewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ViewedCar = mongoose.model("ViewedCar", viewedCarSchema);

module.exports = ViewedCar;
