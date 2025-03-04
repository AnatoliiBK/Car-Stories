const mongoose = require("mongoose");
const Car = require("./models/Car");
require("dotenv").config(); // Підключаємо dotenv для доступу до змінних середовища

// Рядок підключення до MongoDB
const uri = process.env.DB_URI;

const transferCars = async () => {
  try {
    // Підключення до джерела (test)
    const sourceConnection = await mongoose.createConnection(
      "mongodb://localhost:27017/test",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    const sourceCarModel = sourceConnection.model("Car", Car.schema);

    // Отримання даних із джерела
    const cars = await sourceCarModel.find();

    // Підключення до цільової бази (CarStoriesCluster)
    const targetConnection = await mongoose.createConnection(
      "mongodb://localhost:27017/CarStoriesCluster",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    const targetCarModel = targetConnection.model("Car", Car.schema);

    // Збереження даних у цільовій базі
    await targetCarModel.insertMany(cars);
    console.log("Дані успішно перенесено!");

    // Закриття з'єднань
    sourceConnection.close();
    targetConnection.close();
  } catch (error) {
    console.error("Помилка при перенесенні даних:", error);
  }
};

transferCars();
