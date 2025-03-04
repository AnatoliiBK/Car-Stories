const mongoose = require("mongoose");
const Car = require("./models/Car"); // Підключаємо модель Car
const User = require("./models/user"); // Підключаємо модель User
require("dotenv").config(); // Підключаємо dotenv для доступу до змінних середовища

const uri = process.env.DB_URI;

const seedDatabase = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Підключено до бази даних!");

    // Отримуємо першого користувача як автора
    const user = await User.findOne();
    if (!user) {
      console.error("Користувачів у базі даних немає! Додайте хоча б одного.");
      process.exit(1);
    }

    const cars = [
      {
        name: "Tesla Model S",
        brand: "Tesla",
        year: 2024,
        imageUrl:
          "https://res.cloudinary.com/dc5ymynbq/image/upload/v1734292648/Cars/Tesla_Model_S_gjquv6.jpg",
        description:
          "Електричний автомобіль з неймовірною швидкістю і комфортом.",
        approved: false,
        createdBy: user._id, // Прив'язуємо до користувача
      },
      {
        name: "BMW X6",
        brand: "BMW",
        year: 2024,
        imageUrl:
          "https://res.cloudinary.com/dc5ymynbq/image/upload/v1734292648/Cars/BMW_X6_thyvi8.jpg",
        description:
          "Позашляховик преміум-класу з високою потужністю і стилем.",
        approved: false,
        createdBy: user._id,
      },
      {
        name: "Audi Q7",
        brand: "Audi",
        year: 2025,
        imageUrl:
          "https://res.cloudinary.com/dc5ymynbq/image/upload/v1734292648/Cars/Audi_Q7_x5i3sx.jpg",
        description: "Просторий і технологічний автомобіль для всієї родини.",
        approved: false,
        createdBy: user._id,
      },
    ];

    await Car.deleteMany(); // Очищуємо колекцію
    await Car.insertMany(cars); // Додаємо тестові дані
    console.log("Дані успішно додано!");
    process.exit();
  } catch (err) {
    console.error("Помилка:", err);
    process.exit(1);
  }
};

seedDatabase();

// const mongoose = require("mongoose");
// const Car = require("./models/Car"); // Підключаємо модель
// require("dotenv").config(); // Підключаємо dotenv для доступу до змінних середовища

// // Рядок підключення до MongoDB
// const uri = process.env.DB_URI;

// const cars = [
//   {
//     name: "Tesla Model S",
//     brand: "Tesla",
//     year: 2024,
//     imageUrl:
//       "https://res.cloudinary.com/dc5ymynbq/image/upload/v1734292648/Cars/Tesla_Model_S_gjquv6.jpg",
//     description: "Електричний автомобіль з неймовірною швидкістю і комфортом.",
//   },
//   {
//     name: "BMW X6",
//     brand: "BMW",
//     year: 2024,
//     imageUrl:
//       "https://res.cloudinary.com/dc5ymynbq/image/upload/v1734292648/Cars/BMW_X6_thyvi8.jpg",
//     description: "Позашляховик преміум-класу з високою потужністю і стилем.",
//   },
//   {
//     name: "Audi Q7",
//     brand: "Audi",
//     year: 2025,
//     imageUrl:
//       "https://res.cloudinary.com/dc5ymynbq/image/upload/v1734292648/Cars/Audi_Q7_x5i3sx.jpg",
//     description: "Просторий і технологічний автомобіль для всієї родини.",
//   },
// ];

// const seedDatabase = async () => {
//   try {
//     await mongoose.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("Підключено до бази даних!");
//     await Car.deleteMany(); // Очищуємо колекцію
//     await Car.insertMany(cars); // Додаємо тестові дані
//     console.log("Дані успішно додано!");
//     process.exit();
//   } catch (err) {
//     console.error("Помилка:", err);
//     process.exit(1);
//   }
// };

// seedDatabase();
