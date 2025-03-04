// щоб цей скрипт для додавання імен користувачів у всі кошики які не мали цих імен
// спрацював, потрібно було перенести файл з ним в папку backend і в терміналі для
// backend ввести команду node updateCartUserNames.js
// це потрібно було для одноразового оновлення даних, тож скрипт запускався лише раз

const mongoose = require("mongoose");
const Cart = require("../models/cart");
const User = require("../models/user");
require("dotenv").config(); // Підключаємо dotenv для доступу до змінних середовища

// Рядок підключення до MongoDB
const uri = process.env.DB_URI;

async function updateCartUserNames() {
  try {
    // Підключаємося до бази даних, використовуючи URI з файлу .env
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB for updating cart user names.");

    // Знаходимо всі кошики, у яких немає поля userName
    const cartsToUpdate = await Cart.find({ userName: { $exists: false } });

    for (let cart of cartsToUpdate) {
      // Знаходимо відповідного користувача за userId з кошика
      const user = await User.findById(cart.user);

      // Якщо користувач знайдений, додаємо його ім’я до userName в кошику
      if (user) {
        cart.userName = user.name;
        await cart.save(); // Зберігаємо оновлений кошик
      }
    }

    console.log("User names successfully added to all carts.");
  } catch (error) {
    console.error("Error updating cart user names:", error);
  } finally {
    // Закриваємо з'єднання з базою даних
    mongoose.connection.close();
  }
}

// Викликаємо функцію оновлення
updateCartUserNames();
