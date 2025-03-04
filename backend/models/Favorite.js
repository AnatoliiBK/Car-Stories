const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Зв'язок із користувачем
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car", // Зв'язок із автомобілем
      required: true,
    },
  },
  { timestamps: true } // Автоматично додає createdAt і updatedAt
);

// Унікальність записів (один і той самий автомобіль не можна додати кілька разів для одного користувача)
favoriteSchema.index({ createdBy: 1, car: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);

// const mongoose = require("mongoose");

// const FavoriteSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Favorite", FavoriteSchema);
