const mongoose = require("mongoose");
// Додаткові параметри, такі як { timestamps: true }, мають передаватися як
// другий аргумент у функцію new mongoose.Schema
const CarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true, // URL зображення обов’язковий
    },
    description: {
      type: String,
      required: false, // Необов’язково, можна додати пізніше
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Автор
    approved: {
      type: Boolean,
      default: false, // Для модерації
    },
  },
  { timestamps: true } // Автоматично додає createdAt і updatedAt
);

module.exports = mongoose.model("Car", CarSchema);

// Тт не використовується додатковий параметр

// const mongoose = require("mongoose");

// const CarSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   brand: {
//     type: String,
//     required: true,
//   },
//   year: {
//     type: Number,
//     required: true,
//   },
//   imageUrl: {
//     type: String,
//     required: true, // URL зображення обов’язковий
//   },
//   description: {
//     type: String,
//     required: false, // Необов’язково, можна додати пізніше
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   }, // Автор
//   approved: { type: Boolean, default: false }, // Для модерації
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// }); // додатковий параметр в цьому рядку всавляється після фігурної дужки

// module.exports = mongoose.model("Car", CarSchema);
