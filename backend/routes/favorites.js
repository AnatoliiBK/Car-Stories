const Favorite = require("../models/Favorite");
const router = require("express").Router();

const { auth } = require("../middleware/auth");

// Додавання автомобіля до улюблених
router.post("/:id", auth, async (req, res) => {
  try {
    const userId = req.user._id; // Ідентифікатор користувача
    const carId = req.params.id; // Ідентифікатор автомобіля
    console.log("USER ID FAV", userId);
    console.log("CAR ID FAV", carId);

    // Перевірка, чи цей автомобіль вже в улюблених
    const existingFavorite = await Favorite.findOne({
      createdBy: userId,
      car: carId,
    });
    if (existingFavorite) {
      return res.status(200).json({ message: "Автомобіль вже є в улюблених" });
    }

    const favorite = new Favorite({ createdBy: userId, car: carId });
    await favorite.save();

    // Надсилання події через WebSocket
    if (req.app.locals.io) {
      req.app.locals.io.emit("favorite-updated", {
        userId,
        carId,
        isFavorite: true,
      });
    }

    res.status(201).json({ message: "Додано до улюблених", favorite });
  } catch (err) {
    console.error("DETAIL IN SERVER", err.message);
    res.status(500).json({ message: "Помилка сервера", error: err.message });
  }
});

// Видалення автомобіля з улюблених
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const carId = req.params.id;

    const favorite = await Favorite.findOneAndDelete({
      createdBy: userId,
      car: carId,
    });
    if (!favorite) {
      return res
        .status(404)
        .json({ message: "Автомобіль не знайдено в улюблених" });
    }

    // Надсилання події через WebSocket
    if (req.app.locals.io) {
      req.app.locals.io.emit("favorite-updated", {
        userId,
        carId,
        isFavorite: false,
      });
    }

    res.status(200).json({ message: "Видалено з улюблених" });
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера", error: err.message });
  }
});

// Отримання списку улюблених автомобілів
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // const favorites = await Favorite.find({ createdBy: userId }).populate(
    //   "car"
    // ); // Підтягуємо дані автомобілів
    // // console.log("Favorites from DB:", favorites);
    // const favorites = await Favorite.find({ createdBy: userId })
    //   .populate("car")
    //   .populate("createdBy", "name avatar");
    const favorites = await Favorite.find({ createdBy: userId })
      .populate({
        path: "car",
        populate: { path: "createdBy", select: "name avatar" }, // Власник авто
      })
      .populate("createdBy", "name avatar"); // Користувач, що додав в обране

    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера", error: err.message });
  }
});

module.exports = router;

// // Видалення всіх улюблених автомобілів для конкретного автомобіля
// // Цей маршрут буде використовуватись під час видалення автомобіля
// router.delete("/car/:carId", auth, async (req, res) => {
//   try {
//     const carId = req.params.carId;

//     // Видалення всіх записів у колекції favorites, де є цей carId
//     const deletedFavorites = await Favorite.deleteMany({ "car._id": carId });

//     if (deletedFavorites.deletedCount === 0) {
//       return res
//         .status(404)
//         .json({ message: "Не знайдено улюблених для цього автомобіля" });
//     }

//     // Надсилання події через WebSocket
//     if (req.app.locals.io) {
//       req.app.locals.io.emit("favorite-updated", {
//         carId,
//         isFavorite: false,
//       });
//     }

//     res
//       .status(200)
//       .json({ message: "Усі улюблені записи для цього автомобіля видалено." });
//   } catch (err) {
//     res.status(500).json({
//       message: "Помилка сервера при видаленні з улюблених",
//       error: err.message,
//     });
//   }
// });

// const Favorite = require("../models/Favorite");
// const { auth } = require("../middleware/auth");

// const router = require("express").Router();

// // Додавання продукту в обрані
// router.post("/", auth, async (req, res) => {
//   const { productId } = req.body;
//   const userId = req.user._id;

//   try {
//     const existingFavorite = await Favorite.findOne({ userId, productId });
//     if (existingFavorite) {
//       return res
//         .status(400)
//         .json({ message: "Product is already in favorites" });
//     }

//     const favorite = new Favorite({ userId, productId });
//     await favorite.save();
//     res.status(201).json(favorite);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Перевірка чи продукт є в обраних
// router.get("/:productId", auth, async (req, res) => {
//   const { productId } = req.params;
//   const userId = req.user._id;

//   try {
//     const favorite = await Favorite.findOne({ userId, productId });
//     res.status(200).json({ isFavorite: !!favorite });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Отримання всіх обраних продуктів користувача
// router.get("/", auth, async (req, res) => {
//   const userId = req.user._id;

//   try {
//     const favorites = await Favorite.find({ userId }).populate("productId");
//     res.status(200).json(favorites);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Видалення продукту з обраних
// router.delete("/:productId", auth, async (req, res) => {
//   const { productId } = req.params;
//   const userId = req.user._id;

//   try {
//     const favorite = await Favorite.findOneAndDelete({ userId, productId });
//     if (!favorite) {
//       return res
//         .status(404)
//         .json({ message: "Product not found in favorites" });
//     }
//     res.status(200).json({ message: "Product removed from favorites" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
