const express = require("express");
const router = express.Router();
const ViewedCar = require("../models/ViewedCar");
const { auth } = require("../middleware/auth");

// ➤ Додати авто в переглянуті
router.post("/", auth, async (req, res) => {
  try {
    const { carId } = req.body;
    const userId = req.user._id; // Беремо користувача з токена

    // Перевіряємо, чи авто вже є в списку переглянутих
    const existingViewedCar = await ViewedCar.findOne({ userId, carId });
    if (existingViewedCar) {
      return res.status(200).json({ message: "Автомобіль вже переглянуто" });
    }

    // Додаємо авто в переглянуті
    const viewedCar = new ViewedCar({ userId, carId });
    await viewedCar.save();

    // 🔹 Надсилаємо подію WebSocket
    if (req.app.locals.io) {
      req.app.locals.io.emit("viewed-updated", { carId, isViewed: true });
    }

    res.status(201).json(viewedCar);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера" });
  }
});

// ➤ Отримати список переглянутих авто користувача
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    // const viewedCars = await ViewedCar.find({ userId }).populate("carId");

    const viewedCars = await ViewedCar.find({ userId })
      .populate({
        path: "carId",
        populate: {
          path: "createdBy", // Отримуємо власника авто
          select: "name avatar", // Беремо тільки ім'я та аватар
        },
      })
      .populate("userId", "name avatar"); // Користувач, що переглянув
    res.status(200).json(viewedCars);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера" });
  }
});

// ➤ Видалити авто з переглянутих
router.delete("/:carId", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { carId } = req.params;

    const viewedCar = await ViewedCar.findOneAndDelete({ userId, carId });

    if (!viewedCar) {
      return res
        .status(404)
        .json({ message: "Авто не знайдено в переглянутих" });
    }

    // 🔹 Надсилаємо подію WebSocket
    if (req.app.locals.io) {
      req.app.locals.io.emit("viewed-updated", { carId, isViewed: false });
    }

    res.status(200).json({ message: "Авто видалено з переглянутих", carId });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера" });
  }
});

// ➤ Видалити авто з переглянутих для всіх, якщо воно видалене з каталогу
router.delete("/car-deleted/:carId", auth, async (req, res) => {
  try {
    const { carId } = req.params;

    const deletedCars = await ViewedCar.deleteMany({ carId });

    if (deletedCars.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Авто не знайдено у переглянутих" });
    }

    // 🔹 Надсилаємо подію WebSocket
    if (req.app.locals.io) {
      req.app.locals.io.emit("car-deleted", carId);
    }

    res.status(200).json({ message: "Авто видалено з переглянутих для всіх" });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера" });
  }
});

module.exports = router;

// // ➤ Додати авто в переглянуті (без повторень)
// router.post("/", auth, async (req, res) => {
//   try {
//     const { carId } = req.body;
//     const userId = req.user._id;

//     // Перевіряємо, чи вже є авто у списку переглянутих
//     const existingViewedCar = await ViewedCar.findOne({ userId, carId });

//     if (existingViewedCar) {
//       return res
//         .status(200)
//         .json({ message: "Авто вже у списку переглянутих" });
//     }

//     // Додаємо авто в переглянуті
//     const newViewedCar = new ViewedCar({ userId, carId });
//     await newViewedCar.save();

//     res.status(201).json(newViewedCar);
//   } catch (error) {
//     res.status(500).json({ message: "Помилка сервера" });
//   }
// });
