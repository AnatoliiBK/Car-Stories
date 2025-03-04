const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json("Access Denied. No token provided. Auth");
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const user = jwt.verify(token, secretKey);
    req.user = user;
    next();
  } catch (ex) {
    res.status(400).json("Access Denied. Invalid Auth Token");
  }
};

const isAuthenticated = (req, res, next) => {
  auth(req, res, () => {
    if (req.user) {
      next();
    } else {
      res.status(403).json("Access Denied. Not Authenticated");
    }
  });
};

const isUser = (req, res, next) => {
  auth(req, res, () => {
    if (req.user._id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("Access Denied. Not Authorized As A User");
    }
  });
};

const isAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (req.user?.isAdmin) {
      next();
    } else {
      res.status(403).json("Access Denied. Not Authorized As An Admin");
    }
  });
};

module.exports = { auth, isAuthenticated, isUser, isAdmin };

// 1. auth
// Використовується для перевірки, чи передано токен авторизації (x-auth-token) у запиті та чи він дійсний.
// Основне завдання — декодувати токен і зберегти користувача в req.user.
// Коли використовувати: якщо будь-який користувач повинен мати доступ до маршруту, незалежно від його ролі (наприклад, доступ до власного профілю чи публічних ресурсів із токеном).

// 2. isAuthenticated
// Розширення auth. Перевіряє наявність користувача (req.user) після декодування токена.
// Використовується для обмеження доступу тільки для зареєстрованих користувачів.
// Коли використовувати: якщо маршрут доступний лише для авторизованих користувачів, без обмежень на роль (наприклад, доступ до особистого кабінету).

// 3. isUser
// Використовується для перевірки, чи ідентифікатор користувача (req.user._id) збігається з ідентифікатором у запиті (req.params.id) або чи користувач є адміністратором.
// Це обмежує доступ до маршруту тільки для самого користувача або адміністратора.
// Коли використовувати: якщо маршрут стосується особистих даних користувача, але адмін також повинен мати доступ (наприклад, видалення акаунта).

// 4. isAdmin
// Використовується для перевірки, чи користувач є адміністратором (req.user.isAdmin).
// Коли використовувати: якщо маршрут доступний виключно для адміністраторів (наприклад, модерація або адміністрування).
// Вибір для маршруту /pending
// У випадку маршруту /pending, доступ до якого повинні мати лише адміністратори, найбільш доречно використовувати auth разом із isAdmin.

// Результат:
// router.get("/pending", auth, isAdmin, async (req, res) => {
//   try {
//     console.log("Fetching pending cars IN ROUTES...");
//     const pendingCars = await Car.find({ approved: false });
//     res.status(200).json(pendingCars);
//   } catch (error) {
//     console.error("Error fetching pending cars:", error.message);
//     res
//       .status(500)
//       .json({ message: "Помилка при отриманні автомобілів на модерацію." });
//   }
// });
// Чому саме auth + isAdmin?
// auth перевіряє, чи є токен дійсним, і додає інформацію про користувача в req.user.
// isAdmin перевіряє, чи є користувач адміністратором, і лише тоді дозволяє доступ до маршруту.
// Це гарантує, що:

// Лише авторизовані користувачі можуть виконати запит.
// Серед авторизованих користувачів тільки адміністратори мають право доступу.
// Якщо потрібно перевірити конкретні дії користувача
// У випадках, коли доступ має бути залежним від конкретного користувача або адміністратора, використовуйте isUser із відповідною логікою.

// Наприклад:
// router.get("/user/:id", auth, isUser, async (req, res) => {
//   // Тільки сам користувач або адміністратор можуть отримати ці дані
// });
