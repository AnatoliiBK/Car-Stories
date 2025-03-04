const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http"); // 21 01 25

const register = require("./routes/register");
const login = require("./routes/login");
const stripe = require("./routes/stripe");
const productsRoute = require("./routes/products");
const users = require("./routes/users");
const orders = require("./routes/orders");
const favoriteRoutes = require("./routes/favorites");
// const cartRoutes = require("./routes/carts");
const cartRoutes = require("./routes/cartRoutes");
const products = require("./products");
const viewedCarsRoutes = require("./routes/viewedCars");
const cars = require("./routes/cars");
const carSpecsRoutes = require("./routes/carSpecsRoutes");
const setupWebSocket = require("./websocket"); // Імпортуємо WebSocket  21 01 25

const app = express();
const server = http.createServer(app); // Створюємо сервер HTTP  21 01 25

require("dotenv").config();

// app.use(express.json());
// Збільшення розміру тіла запиту до 50MB
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// глобальна перевірка маршрутів
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.originalUrl}`);
//   next();
// });

app.use(cors());

app.use("/register", register);
app.use("/login", login);
app.use("/stripe", stripe);
app.use("/products", productsRoute);
app.use("/users", users);
app.use("/orders", orders);
app.use("/favorites", favoriteRoutes);
app.use("/cart", cartRoutes);
app.use("/cars", cars);
app.use("/viewed-cars", viewedCarsRoutes);
app.use("/car-specs", carSpecsRoutes);

// app.use("/api/register", register);
// app.use("/api/login", login);
// app.use("/api/stripe", stripe);
// app.use("/api/products", productsRoute);
// app.use("/api/users", users);
// app.use("/api/orders", orders);
// app.use("/api/favorites", favoriteRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/cars", cars);

const uri = process.env.DB_URI;
const port = process.env.PORT || 5000;

// 21 01 25 вдалено і перенесено в кінець
// app.listen(port, () => {
//   console.log(`Server running on port: ${port}`);
// });

// Опції useNewUrlParser та useUnifiedTopology більше не мають ефекту з версії
// драйвера MongoDB 4.0.0 і будуть видалені в наступній основній версії. Щоб
// виправити ці попередження, треба просто видалити ці опції з коду
// підключення.

mongoose
  // .connect(uri, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // })
  .connect(uri)
  .then(() => console.log("MongoDB Connected For Car Stories!"))
  .catch((error) => console.error("MongoDB connection failed:", error.message));

// Налаштовуємо WebSocket  21 01 25
const io = setupWebSocket(server);
app.locals.io = io; // Додаємо WebSocket-інстанс до локальних змінних app

// Запуск сервера
server.listen(port, () => {
  console.log(`Web Socket Server running on port: ${port}`);
});
