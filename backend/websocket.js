const { Server } = require("socket.io");

function setupWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Дозволяє всі джерела (або вкажіть конкретні домени, якщо потрібно)
      methods: ["GET", "POST"],
    },
  });

  // Обробка подій підключення клієнтів
  io.on("connection", (socket) => {
    console.log("🔗 Новий клієнт підключився");

    socket.on("join", (userId) => {
      console.log("👤 Користувач приєднався до кімнати:", userId);
      socket.join(userId); // ← Ось це головне
    });

    // socket.on("viewed-car", (carId) => {
    //   console.log(`🚗 Авто переглянуте: ${carId}`);
    //   io.emit("viewed-car", carId); // 📡 Надсилаємо carId для точкового оновлення
    // });
    // socket.on("favorite-updated", (carId) => {
    //   console.log(`🚗 Авто улюблене: ${carId}`);
    //   io.emit("favorite-updated", carId); // 📡 Надсилаємо carId для точкового оновлення
    // });
    // // Коли хтось переглянув авто, розсилаємо подію всім клієнтам
    // socket.on("viewed-car", () => {
    //   io.emit("viewed-car"); // 📡 Оновлення для всіх
    // });

    // Можна додати обробники подій за необхідністю

    socket.on("disconnect", () => {
      console.log("❌ Клієнт відключився");
    });
  });

  return io;
}

module.exports = setupWebSocket;
