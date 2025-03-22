const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { auth, isAdmin } = require("../middleware/auth");
const router = express.Router();
const Car = require("../models/Car"); // Модель автомобіля
// Підключення WebSocket
const io = require("../websocket"); // Імпортуємо WebSocket екземпляр

// Налаштування multer
const storage = multer.memoryStorage();
const upload = multer({ storage });
const streamifier = require("streamifier"); //для завантаження зображень через потік

router.get("/", async (req, res) => {
  try {
    const { brand, year, sort } = req.query; // Отримуємо параметри з запиту

    // // Формуємо фільтр (це без врахування модерації)
    // const filter = {};
    const filter = { approved: true }; // Відображаємо тільки затверджені автомобілі
    // (модеровані)
    if (brand) filter.brand = brand; // Фільтруємо за маркою
    if (year) filter.year = year; // Фільтруємо за роком

    // Формуємо сортування
    const sortOptions = {};
    if (sort === "name") sortOptions.name = 1; // Сортування за назвою (A-Z)
    if (sort === "year") sortOptions.year = -1; // Сортування за роком (новіші)

    // Виконуємо пошук у базі даних
    // const cars = await Car.find(filter).sort(sortOptions);
    const cars = await Car.find(filter)
      .populate("createdBy", "name avatar") // Наповнюємо інформацією про користувача
      .sort(sortOptions); // Сортуємо за роком

    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({
      message: "Помилка при отриманні автомобілів",
      error: err.message,
    });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const { brand, year, sort } = req.query; // Отримуємо параметри з запиту

    // Отримуємо ID поточного користувача з req.user (залежить від вашої системи авторизації)
    const userId = req.user._id; // Припускаємо, що ID користувача доступний тут

    const filter = {
      approved: true, // Відображаємо тільки затверджені автомобілі
    };

    filter["createdBy"] = userId; // Додаємо ключ динамічно

    // (модеровані)
    if (brand) filter.brand = brand; // Фільтруємо за маркою
    if (year) filter.year = year; // Фільтруємо за роком

    // Формуємо сортування
    const sortOptions = {};
    if (sort === "name") sortOptions.name = 1; // Сортування за назвою (A-Z)
    if (sort === "year") sortOptions.year = -1; // Сортування за роком (новіші)

    // Виконуємо пошук у базі даних
    // const cars = await Car.find(filter).sort(sortOptions);
    const cars = await Car.find(filter)
      .populate("createdBy", "name avatar") // Наповнюємо інформацією про користувача
      .sort(sortOptions); // Сортуємо за роком

    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({
      message: "Помилка при отриманні автомобілів",
      error: err.message,
    });
  }
});

// Отримання автомобілів для модерації. маршрут, який повертає список автомобілів,
// що очікують на модерацію (approved: false):
router.get("/pending", auth, isAdmin, async (req, res) => {
  try {
    const pendingCars = await Car.find({ approved: false });
    console.log("Pending Cars IN ROUTES : ", pendingCars); // Додайте цей лог для перевірки
    res.status(200).json(pendingCars);
  } catch (error) {
    console.error("Error fetching pending cars:", error.message);
    res
      .status(500)
      .json({ message: "Помилка при отриманні автомобілів на модерацію." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    // const car = await Car.findById(req.params.id);
    const car = await Car.findOne({ _id: req.params.id, approved: true }); // Додано approved: true
    if (!car) {
      return res
        .status(404)
        .json({ message: "Автомобіль не знайдено або не затверджено." });
    }
    res.status(200).json(car);
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера", error: err.message });
  }
});

// Додавання автомобіля користувачами з використанням стріму для завантаження
// зображення з буфера.
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    // Перевірка наявності файлу
    if (!req.file) {
      return res.status(400).json({ message: "Зображення є обов'язковим." });
    }

    // Завантаження зображення у Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "Car Images CS",
          upload_preset: "cars CS",
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const { name, brand, year, description } = req.body;

    // Створення нового автомобіля
    const car = new Car({
      name,
      brand,
      year,
      description,
      imageUrl: result.secure_url, // Додаємо URL зображення
      createdBy: req.user._id,
    });

    await car.save();
    // Надсилання даних через Socket.IO
    if (req.app.locals.io) {
      req.app.locals.io.emit("pending-car-added", car); // Подія "pending-car-added" для клієнтів
    }

    res
      .status(201)
      .json({ message: "Автомобіль успішно додано та очікує модерацію." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при додаванні автомобіля." });
  }
});

//Адміністративний маршрут для модерації. Затвердження автомобіля
router.patch("/:id/approve", auth, isAdmin, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Автомобіль не знайдено." });
    }

    car.approved = true; // Затверджуємо
    await car.save();

    // Надсилання даних через Socket.IO
    if (req.app.locals.io) {
      req.app.locals.io.emit("new-car", car); // Подія "new-car" для клієнтів
    }

    res.status(200).json({ message: "Автомобіль затверджено." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при затвердженні автомобіля." });
  }
});

// Редагування картки автомобіля
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, year, description } = req.body;

    let car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Автомобіль не знайдено." });
    }

    // Перевірка, чи користувач є власником або адміністратором
    if (
      req.user._id.toString() !== car.createdBy._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: "Недостатньо прав для редагування." });
    }

    // Якщо передано нове зображення
    let imageUrl = car.imageUrl;
    if (req.file) {
      // Видаляємо старе зображення з Cloudinary
      const oldImagePublicId = car.imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`Car Images CS/${oldImagePublicId}`);

      // Завантажуємо нове зображення в Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "Car Images CS",
            upload_preset: "cars CS",
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      imageUrl = result.secure_url;
    }

    // Оновлення автомобіля
    car = await Car.findByIdAndUpdate(
      id,
      { name, brand, year, description, imageUrl },
      { new: true } // Повернути оновлений документ
    );

    // Надсилання оновлення через WebSocket
    if (req.app.locals.io) {
      req.app.locals.io.emit("car-updated", car);
    }

    res.status(200).json({ message: "Автомобіль оновлено.", car });
  } catch (error) {
    console.error("Помилка при редагуванні автомобіля:", error);
    res.status(500).json({ message: "Помилка при редагуванні автомобіля." });
  }
});

// Видалення автомобіля
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Автомобіль не знайдено." });
    }

    // Отримуємо public_id зображення з Cloudinary
    const imagePublicId = car.imageUrl.split("/").pop().split(".")[0];

    // Видаляємо зображення з Cloudinary
    await cloudinary.uploader.destroy(
      `Car Images CS/${imagePublicId}`,
      (error, result) => {
        if (error) {
          console.error(
            "Помилка при видаленні зображення з Cloudinary:",
            error
          );
          return res
            .status(500)
            .json({ message: "Помилка при видаленні зображення." });
        }
        console.log("Зображення успішно видалено з Cloudinary:", result);
      }
    );

    // Видаляємо запис автомобіля з бази даних
    await car.deleteOne();

    // // Надсилаємо повідомлення через WebSocket
    // io.emit("car-deleted", { carId: req.params.id });
    // Надсилаємо повідомлення про видалення через WebSocket
    if (req.app.locals.io) {
      req.app.locals.io.emit("car-deleted", car._id);
    }

    res
      .status(200)
      .json({ message: "Автомобіль та зображення успішно видалено." });
  } catch (error) {
    console.error("Помилка при видаленні автомобіля:", error);
    res.status(500).json({ message: "Помилка при видаленні автомобіля." });
  }
});

module.exports = router;

// router.delete("/:id", auth, isAdmin, async (req, res) => {
//   try {
//     const car = await Car.findById(req.params.id);
//     if (!car) {
//       return res.status(404).json({ message: "Автомобіль не знайдено." });
//     }

//     await car.deleteOne();
//     res.status(200).json({ message: "Автомобіль успішно видалено." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Помилка при видаленні автомобіля." });
//   }
// });

// Додавання нового автомобіля користувачамиз механізмом завантаження зображення
// через потік:
// router.post("/", auth, upload.single("image"), async (req, res) => {
//   try {
//     let result;
//     if (req.file) {
//       result = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           {
//             folder: "Car Images CS",
//             upload_preset: "cars CS",
//           },
//           (error, result) => {
//             if (error) reject(error);
//             resolve(result);
//           }
//         );
//         streamifier.createReadStream(req.file.buffer).pipe(stream);
//       });
//     }

//     const { name, brand, year, description } = req.body;

//     // Створення нового автомобіля
//     const car = new Car({
//       name,
//       brand,
//       year,
//       description,
//       imageUrl: result ? result.secure_url : null, // Додаємо URL зображення
//       createdBy: req.user._id,
//     });

//     await car.save();

//     res
//       .status(201)
//       .json({ message: "Автомобіль успішно додано та очікує модерацію." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Помилка при додаванні автомобіля." });
//   }
// });

// // Додавання автомобіля користувачами
// router.post("/", auth, upload.single("image"), async (req, res) => {
//   try {
//     // Завантаження зображення у Cloudinary
//     const result = await cloudinary.uploader.upload_stream({
//       folder: "Car Images CS",
//       upload_preset: "cars CS",
//     });

//     const { name, brand, year, description } = req.body;

//     // Створення нового автомобіля
//     const car = new Car({
//       name,
//       brand,
//       year,
//       description,
//       imageUrl: result.secure_url,
//       createdBy: req.user._id,
//     });

//     await car.save();

//     res
//       .status(201)
//       .json({ message: "Автомобіль успішно додано та очікує модерацію." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Помилка при додаванні автомобіля." });
//   }
// });
