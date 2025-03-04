// const Favorite = require("../models/Favorite");
// const { auth } = require("../middleware/auth");

// const router = require("express").Router();

// // Додавання продукту в обрані
// router.post("/", auth, async (req, res) => {
//   const { carId } = req.body;
//   const userId = req.user._id;

//   try {
//     const existingFavorite = await Favorite.findOne({ userId, carId });
//     if (existingFavorite) {
//       return res.status(400).json({ message: "Car is already in favorites" });
//     }

//     const favorite = new Favorite({ userId, carId });
//     await favorite.save();
//     res.status(201).json(favorite);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Перевірка чи продукт є в обраних
// router.get("/:carId", auth, async (req, res) => {
//   const { carId } = req.params;
//   const userId = req.user._id;

//   try {
//     const favorite = await Favorite.findOne({ userId, carId });
//     res.status(200).json({ isFavorite: !!favorite });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Отримання всіх обраних продуктів користувача
// router.get("/", auth, async (req, res) => {
//   const userId = req.user._id;

//   try {
//     const favorites = await Favorite.find({ userId }).populate("carId");
//     res.status(200).json(favorites);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Видалення продукту з обраних
// router.delete("/:carId", auth, async (req, res) => {
//   const { carId } = req.params;
//   const userId = req.user._id;

//   try {
//     const favorite = await Favorite.findOneAndDelete({ userId, carId });
//     if (!favorite) {
//       return res.status(404).json({ message: "Car not found in favorites" });
//     }
//     res.status(200).json({ message: "Car removed from favorites" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
