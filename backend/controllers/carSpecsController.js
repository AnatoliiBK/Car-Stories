const CarSpecs = require("../models/CarSpecsSchema");
const Car = require("../models/Car");
const PermissionRequest = require("../models/PermissionRequest");
const { aiSearchFunction } = require("../utils/aiSearch");
const bingSearchFunction = require("../utils/bingSearch");
const { msnSearchFunction } = require("../utils/msnSearchCarSpecs");
const { googleSearchCarSpecs } = require("../utils/googleSearch");
const { nhtsaSearchCarSpecs } = require("../utils/nhtsaSearch");
const axios = require("axios");
require("dotenv").config(); // Завантажує змінні середовища
const cheerio = require("cheerio");

// const AUTO_RIA_API_KEY = process.env.AUTO_RIA_API_KEY;

// Функція для парсингу HTML та витягнення специфікацій
const parseCarSpecs = async (url) => {
  try {
    const response = await axios.get(url, {
      // headers: { "User-Agent": "Mozilla/5.0 ..." },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    // console.log("📌 Отримана сторінка HTML:\n", response.data);

    // Парсимо сторінку, шукаємо дані
    const $ = cheerio.load(response.data);
    let fuelType = $("span.fuel-type").text().trim().toLowerCase();

    // Перекладаємо англійські назви у формат MongoDB
    const fuelTypeMap = {
      gasoline: "бензин",
      diesel: "дизель",
      hybrid: "гібрид",
      electric: "електро",
    };

    fuelType = fuelTypeMap[fuelType] || "";

    if (!fuelType) {
      console.warn("⚠️ Не вдалося визначити тип палива, ставимо 'бензин'");
      fuelType = "бензин"; // Значення за замовчуванням
    }

    // console.log("📌 Отримані сирі дані зі сторінки:", $.html());
    console.log("📌 Об'єм двигуна:", $("span.engine-size").text());
    console.log("📌 Потужність:", $("span.hp").text());
    console.log("📌 Крутний момент:", $("span.torque").text());
    console.log("📌 Витрата пального:", $("span.fuel-consumption").text());
    console.log("📌 Коробка передач:", $("span.transmission").text());

    return {
      fuelType,
      combustionEngine: {
        engineDisplacement: parseFloat($("span.engine-size").text()) || 0,
        horsepower: parseInt($("span.hp").text()) || 0,
        torque: parseInt($("span.torque").text()) || 0,
        fuelConsumption: parseFloat($("span.fuel-consumption").text()) || 0,
        transmission: $("span.transmission").text().trim() || "невідомо",
      },
    };
  } catch (error) {
    console.error("❌ Помилка парсингу:", error.message);
    return null;
  }
};

exports.msnSearchCarSpecs = async (req, res) => {
  // const { make, model, year, carId } = req.body;
  const { make, model, year, carId, createdBy } = req.body; // 🛠️ Додаємо createdBy

  try {
    const msnResults = await msnSearchFunction(make, model, year);

    if (!msnResults || msnResults.length === 0) {
      return res
        .status(404)
        .json({ message: "MSN не знайшов характеристик для цього авто." });
    }

    // 🔍 Перевірка, чи вже існують характеристики з MSN для цього авто
    const existing = await CarSpecs.findOne({ carId, source: "msn" });

    if (existing) {
      return res.status(409).json({
        message: "Характеристики з MSN вже збережені для цього авто.",
        existingSpecs: existing,
      });
    }

    // ✅ Якщо немає — зберігаємо нові
    const carSpecs = new CarSpecs({
      carId,
      createdBy,
      source: "msn",
      usefulLinks: msnResults.map((result) => ({
        title: result.title,
        url: result.url,
      })),
      additionalSpecs: {
        description: `Дані отримані через MSN (site:autos.msn.com) для ${make} ${model} ${year}`,
      },
    });

    await carSpecs.save();

    res.status(200).json({
      message: "MSN-результати успішно збережені!",
      carSpecs,
    });
  } catch (error) {
    console.error("Помилка MSN-пошуку:", error);
    res.status(500).json({ message: "Сталася помилка при пошуку через MSN." });
  }
};

// Кешування даних (наприклад, на 24 години)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// ✅ Додавання характеристик у базу
exports.addCarSpecs = async (req, res) => {
  try {
    const { carId, createdBy, ...rest } = req.body;

    // 🔍 Перевірка існування авто
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Авто не знайдено" });

    // 👤 Перевірка прав доступу: власник або адмін
    const isOwner = car.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      const existingRequest = await PermissionRequest.findOne({
        carId,
        requesterId: req.user._id,
      });

      if (!existingRequest || !existingRequest.approved) {
        return res.status(403).json({
          message: "Немає дозволу на додавання характеристик",
        });
      }
    }

    // 🆕 Створення нового документа CarSpecs
    const specs = new CarSpecs({
      carId,
      createdBy: req.user._id, // 👤 Автор — поточний користувач
      ...rest,
    });

    await specs.save();
    res.status(201).json(specs);
  } catch (error) {
    console.error("❌ Помилка додавання характеристик:", error);
    res.status(500).json({ error: "Не вдалося додати характеристики авто" });
  }
};
// exports.addCarSpecs = async (req, res) => {
//   try {
//     const { carId, createdBy, ...rest } = req.body; // 🛠️ ОНОВЛЕНО: createdBy
//     // const specs = new CarSpecs(req.body);
//     const specs = new CarSpecs({
//       carId,
//       createdBy,
//       // source: "manual",
//       // source,
//       ...rest,
//     });
//     await specs.save();
//     res.status(201).json(specs);
//   } catch (error) {
//     console.error("❌ Помилка додавання характеристик:", error);
//     res.status(500).json({ error: "Не вдалося додати характеристики авто" });
//   }
// };

exports.getPermissionRequestsList = async (req, res) => {
  try {
    //витягує список автомобілів, створених поточним користувачем (req.user._id)
    const myCars = await Car.find({ createdBy: req.user._id }).select("_id");

    const requests = await PermissionRequest.find({
      //🔹 Шукає всі об'є'кти, де carId входить ($in) до списку myCars (значення carId співпадає з ідентифікатлрами автомобілів зі списку myCars)
      carId: { $in: myCars.map((c) => c._id) },
    })
      .populate("carId", "name brand year") //2️⃣ .populate("carId", "name brand year")
      //  🔹 Автоматично замінює carId об'єктом із даними про авто (name, brand, year).
      .populate("requesterId", "name email");

    const showIcon = requests.some((r) => r.approved !== null);
    if (req.app.locals.io) {
      const io = req.app.locals.io;

      io.to(req.user._id.toString()).emit("permission-requests-updated", {
        userId: req.user._id.toString(),
        showIcon,
      });
    }

    // res.status(200).json(requests);
    res.status(200).json({
      requests,
      showIcon,
    });
  } catch (error) {
    console.error("❌ Помилка отримання списку запитів:", error);
    res.status(500).json({ error: "Не вдалося отримати список запитів" });
  }
};

exports.getPermissionRequestStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // Пошук запитів до авто користувача (власника)
    const userCarRequests = await PermissionRequest.find()
      .populate("carId", "createdBy") // беремо лише createdBy
      .lean();

    // Фільтруємо ті, які стосуються авто поточного користувача
    const relevantRequests = userCarRequests.filter(
      (req) => req.carId?.createdBy?.toString() === userId.toString()
    );

    const showIcon = relevantRequests.some((r) => r.approved !== null);
    if (req.app.locals.io) {
      const io = req.app.locals.io;

      io.to(req.user._id.toString()).emit("permission-requests-status", {
        userId: req.user._id.toString(),
        showIcon,
      });
    }

    return res.json({
      showIcon,
    });
  } catch (error) {
    console.error("❌ Помилка отримання статусу запитів:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
};

exports.getMyPermissionResponses = async (req, res) => {
  try {
    const myResponses = await PermissionRequest.find({
      requesterId: req.user._id,
      approved: { $in: [true, false] }, // тільки ті, на які вже відповіли
    })
      .populate("carId", "name brand year createdBy")
      .sort({ updatedAt: -1 });

    const formatted = myResponses.map((r) => ({
      _id: r._id,
      approved: r.approved,
      ownerId: r.carId.createdBy,
      carId: r.carId._id,
      carName: r.carId.name,
      carBrand: r.carId.brand,
      carYear: r.carId.year,
      createdAt: r.createdAt,
      timestamp: new Date(r.updatedAt).getTime(),
    }));

    res.status(200).json({ responses: formatted });
  } catch (err) {
    console.error("❌ Не вдалося отримати відповіді:", err);
    res.status(500).json({ error: "Не вдалося завантажити відповіді" });
  }
};

exports.respondToPermissionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const request = await PermissionRequest.findById(id).populate("carId");

    if (!request) return res.status(404).json({ message: "Запит не знайдено" });

    // Перевірити, що поточний користувач — власник авто
    if (request.carId.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ message: "Немає прав на зміну запиту" });
    }

    request.approved = approved;
    if (approved) {
      request.approvedAt = new Date(); // 👉 TTL на 24 години
      request.rejectedAt = null; // про всяк випадок
    } else {
      request.rejectedAt = new Date(); // 👉 TTL на 12 годин
      request.approvedAt = null; // про всяк випадок
    }
    await request.save();

    // ✅ === 🔔 Надіслати повідомлення двом користувачам через WebSocket ===
    if (req.app.locals.io) {
      const io = req.app.locals.io;
      console.log("📤 Відправка оновлення до:", request.requesterId.toString());

      // 🔵 1. Запитувачу (щоб він бачив відповідь на свій запит)
      io.to(request.requesterId.toString()).emit("permission-request-updated", {
        userId: request.requesterId.toString(), // userId того хто надіслав запит тобто кому надіслати сповіщення
        ownerId: request.carId.createdBy.toString(),
        requestId: request._id, // requestId цлого об1єкту запиту
        approved,
        carId: request.carId._id,
        carName: request.carId.name,
        carBrand: request.carId.brand,
        carYear: request.carId.year,
      });

      // 🟢 2. Власнику авто (щоб оновився лічильник запитів у NavBar)
      const allRequests = await PermissionRequest.find()
        .populate("carId", "createdBy")
        .lean();

      const relevantRequests = allRequests.filter(
        (r) => r.carId?.createdBy?.toString() === req.user._id.toString()
      );

      const showIcon = relevantRequests.some((r) => r.approved !== null);
      io.to(req.user._id.toString()).emit("permission-request-updated", {
        userId: req.user._id.toString(),
        showIcon,
      });
    }

    res.status(200).json({
      message: approved ? "✅ Запит підтверджено" : "❌ Запит відхилено",
      request: {
        _id: request._id,
        approved,
        requesterId: request.requesterId,
        carId: request.carId,
      },
    });
  } catch (error) {
    console.error("❌ Помилка відповіді на запит:", error);
    res.status(500).json({ error: "Не вдалося оновити запит" });
  }
};

exports.clearPermissionResponses = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("🧾 USER ID в clearUserPermissionResponses:", userId);

    // // Приклад: зробити approved/rejected запити "невидимими" для юзера
    // await PermissionRequest.updateMany(
    //   {
    //     requesterId: userId,
    //     approved: { $in: [true, false] },
    //   },
    //   { $unset: { approved: "", approvedAt: "", rejectedAt: "" } } // або будь-яка логіка очищення
    // );

    // Видаляємо всі документи, де requesterId відповідає userId і approved є true або false
    const result = await PermissionRequest.deleteMany({
      requesterId: userId,
      approved: { $in: [true, false] },
    });

    if (req.app.locals.io) {
      const io = req.app.locals.io;
      io.emit("permission-response-deleted", { userId });
    }

    // res.status(200).json({ message: "Відповіді очищено" });
    res.status(200).json({
      message: "Відповіді очищено",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("❌ Помилка очищення відповідей:", error);
    res.status(500).json({ error: "Не вдалося очистити відповіді" });
  }
};

exports.deleteSinglePermissionResponse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    console.log("🧾 USER ID:", userId);
    console.log("🪪 ID param:", id);

    const deleted = await PermissionRequest.findOneAndDelete({
      _id: id,
      requesterId: userId,
      approved: { $in: [true, false] },
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Запис не знайдено або вже видалений" });
    }

    if (req.app.locals.io) {
      const io = req.app.locals.io;
      io.emit("permission-response-deleted", { userId });
    }

    res.status(200).json({ message: "Відповідь видалено" });
  } catch (error) {
    console.error("❌ Помилка при видаленні відповіді:", error);
    res.status(500).json({ error: "Не вдалося видалити відповідь" });
  }
};

// ✅ /my-pending Отримання кількості запитів на дозвіл додавання х-к іншим користувачем (неопрацьовані)
exports.getPermissionRequests = async (req, res) => {
  try {
    const myCars = await Car.find({ createdBy: req.user._id }).select("_id");

    const myCarIds = myCars.map((car) => car._id);

    const pendingRequests = await PermissionRequest.countDocuments({
      carId: { $in: myCarIds },
      approved: null,
    });

    res.status(200).json({ count: pendingRequests });
  } catch (error) {
    console.error("❌ Помилка отримання запитів:", error);
    res.status(500).json({ error: "Не вдалося отримати запити" });
  }
};

exports.createPermissionRequest = async (req, res) => {
  try {
    // Коли форма надсилає дані, сервер отримує їх у req.body
    const { carId } = req.body;
    // const { carId, requesterId } = req.body;
    const requesterId = req.user._id; // 👈 безпечно та надійно

    // Перевірка чи запит вже існує
    const existingRequest = await PermissionRequest.findOne({
      carId,
      requesterId,
    });

    if (existingRequest) {
      return res.status(200).json({
        message: "📨 Запит вже надіслано",
      });
    }

    const newRequest = new PermissionRequest({
      carId,
      requesterId,
      // approved: false,
    });

    await newRequest.save();

    // ✅ Надіслати власнику авто повідомлення про новий запит
    const car = await Car.findById(carId).select("createdBy");
    console.log("🔍 Перевірка авто:", car);

    console.log("📡 Еміт події до кімнати:", car.createdBy.toString());

    if (req.app.locals.io && car) {
      req.app.locals.io
        .to(car.createdBy.toString())
        .emit("permission-request-added", {
          carId,
          requesterId,
          requestId: newRequest._id,
        });
      console.log("📡 Подія 'permission-request-added' надіслана");
    }

    res.status(201).json({
      message: "📩 Запит на дозвіл надіслано власнику",
      request: newRequest,
    });
  } catch (error) {
    console.error("❌ Помилка створення запиту на дозвіл:", error);
    res.status(500).json({ error: "Не вдалося надіслати запит" });
  }
};

// ✅ Отримання характеристик з бази
exports.getCarSpecs = async (req, res) => {
  try {
    // const specs = await CarSpecs.findOne({ carId: req.params.carId });
    const specs = await CarSpecs.findOne({ carId: req.params.carId })
      // .populate("carId", "brand name year createdBy")
      .populate({
        path: "carId",
        select: "brand name year createdBy",
        populate: {
          path: "createdBy",
          select: "name email",
        },
      })
      .populate("createdBy", "name email"); // 🛠️ ОНОВЛЕНО
    if (!specs) {
      return res.status(404).json({ message: "Характеристики не знайдено" });
    }
    res.json(specs);
  } catch (error) {
    res.status(500).json({ error: "Помилка отримання характеристик авто" });
  }
};

// 🆕 ОНОВЛЕННЯ характеристик
exports.updateCarSpecs = async (req, res) => {
  try {
    const { carId } = req.params;
    // const { userId, ...updates } = req.body; // 🛠️ userId для перевірки власника
    const updates = req.body;

    const existingSpecs = await CarSpecs.findById(carId);
    if (!existingSpecs) {
      return res.status(404).json({ message: "Характеристики не знайдено" });
    }

    const userId = req.user._id;
    const isAdmin = req.user.isAdmin;

    // if (existingSpecs.createdBy.toString() !== userId) {
    //   return res
    //     .status(403)
    //     .json({ message: "Ви не маєте права редагувати ці характеристики" });
    // }
    if (!existingSpecs.createdBy.equals(userId) && !isAdmin) {
      return res.status(403).json({
        message: "Ви не маєте права редагувати ці характеристики",
      });
    }

    Object.assign(existingSpecs, updates);
    await existingSpecs.save();

    res
      .status(200)
      .json({ message: "Характеристики оновлено!", carSpecs: existingSpecs });
  } catch (error) {
    console.error("❌ Помилка оновлення:", error);
    res.status(500).json({ message: "Не вдалося оновити характеристики" });
  }
};

// 🆕 ВИДАЛЕННЯ характеристик
exports.deleteCarSpecs = async (req, res) => {
  try {
    const { id } = req.params;
    // const { userId } = req.body;

    const existingSpecs = await CarSpecs.findById(id);
    if (!existingSpecs) {
      return res.status(404).json({ message: "Характеристики не знайдено" });
    }

    const userId = req.user._id;
    const isAdmin = req.user.isAdmin;

    // if (existingSpecs.createdBy.toString() !== userId) {
    //   return res
    //     .status(403)
    //     .json({ message: "Ви не маєте права видаляти ці характеристики" });
    // }
    if (!existingSpecs.createdBy.equals(userId) && !isAdmin) {
      return res.status(403).json({
        message: "Ви не маєте права видаляти ці характеристики",
      });
    }

    await existingSpecs.deleteOne();
    res.status(200).json({ message: "Характеристики видалено!" });
  } catch (error) {
    console.error("❌ Помилка видалення:", error);
    res.status(500).json({ message: "Не вдалося видалити характеристики" });
  }
};

// Функція для отримання даних з GCS і NHTSA
exports.getCarSpecsFromGCS = async (req, res) => {
  try {
    // const { carId, make, model, year, vin } = req.body;
    const { carId, make, model, year, vin, createdBy } = req.body;
    console.log("Отримано дані з клієнта:", req.body);

    if (!carId || (!vin && (!make || !model || !year))) {
      return res
        .status(400)
        .json({ error: "Потрібен carId і VIN або make, model, year" });
    }

    let existingSpecs = await CarSpecs.findOne({ carId, source: "nhtsa" });
    if (existingSpecs) {
      console.log("✅ Характеристики отримано з кешу");
      return res.status(200).json({
        message: "Характеристики отримано з кешу",
        carSpecs: existingSpecs,
      });
    }

    const results = await googleSearchCarSpecs(`${make} ${model} ${year}`);
    const usefulLinks = results.length
      ? results.map((item) => ({
          title: item.title,
          url: item.link,
        }))
      : [];
    console.log("🔍 Корисні посилання з GCS:", usefulLinks);

    const nhtsaSpecs = await nhtsaSearchCarSpecs({ vin, make, model, year });
    console.log("📋 Результати від NHTSA:", nhtsaSpecs);

    if (!nhtsaSpecs) {
      const newCarSpecs = new CarSpecs({
        carId,
        createdBy,
        vin,
        source: "gcs",
        usefulLinks,
      });
      await newCarSpecs.save();
      console.log("✅ Збережено лише посилання з GCS");
      return res.status(200).json({
        message:
          "Технічні характеристики не знайдено, збережено лише посилання",
        carSpecs: newCarSpecs,
      });
    }

    const newCarSpecs = new CarSpecs({
      carId,
      createdBy,
      vin,
      source: "nhtsa",
      usefulLinks,
      ...nhtsaSpecs,
    });

    await newCarSpecs.save();
    console.log("✅ Дані збережено в MongoDB");

    res.status(200).json({
      message: "Характеристики додано",
      carSpecs: newCarSpecs,
    });
  } catch (error) {
    console.error("❌ Помилка в getCarSpecsFromGCS:", error.message);
    res.status(500).json({ error: "Помилка сервера" });
  }
};

// Отримання збережених характеристик авто з GCS
exports.getCarSpecsByCarId = async (req, res) => {
  try {
    const carSpecs = await CarSpecs.findOne({ carId: req.params.carId });

    if (!carSpecs) {
      return res.status(404).json({ error: "Характеристики не знайдені" });
    }

    res.status(200).json(carSpecs);
  } catch (error) {
    console.error("Помилка отримання характеристик:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
};

// 🔹 Bing-пошук характеристик
exports.bingSearchCarSpecs = async (req, res) => {
  // const { make, model, year, carId } = req.body;
  const { make, model, year, carId, createdBy } = req.body; // 🛠️ Додаємо createdBy

  try {
    const bingResults = await bingSearchFunction(make, model, year);

    if (bingResults && bingResults.length > 0) {
      const carSpecs = new CarSpecs({
        carId,
        createdBy,
        source: "bing",
        usefulLinks: bingResults.map((result) => ({
          title: result.title,
          url: result.url,
        })),
        additionalSpecs: {
          description: `Дані отримані через Bing для ${make} ${model} ${year}`,
        },
      });

      await carSpecs.save();
      res
        .status(200)
        .json({ message: "Bing-результати успішно збережені!", carSpecs });
    } else {
      res
        .status(404)
        .json({ message: "Bing не знайшов характеристик для цього авто." });
    }
  } catch (error) {
    console.error("Помилка Bing-пошуку:", error);
    res.status(500).json({ message: "Сталася помилка при пошуку через Bing." });
  }
};

exports.aiSearchCarSpecs = async (req, res) => {
  // const { make, model, year, carId } = req.body;
  const { make, model, year, carId, createdBy } = req.body; // 🛠️ Додаємо createdBy

  try {
    // Викликаємо AI для пошуку характеристик
    const aiResponse = await aiSearchFunction(make, model, year);

    if (aiResponse) {
      const carSpecs = new CarSpecs({
        carId,
        createdBy,
        source: "AI", // Позначаємо, що це AI пошук
        fuelType: aiResponse.fuelType,
        combustionEngine: {
          engineDisplacement: aiResponse.engineDisplacement,
          horsepower: aiResponse.horsepower,
          torque: aiResponse.torque,
          transmission: aiResponse.transmission,
        },
        electric: {
          batteryCapacity: aiResponse.batteryCapacity,
          electricRange: aiResponse.electricRange,
        },
        additionalSpecs: aiResponse.additionalSpecs || {},
      });

      await carSpecs.save();
      res
        .status(200)
        .json({ message: "Характеристики успішно додані!", carSpecs });
    } else {
      res
        .status(404)
        .json({ message: "AI не зміг знайти характеристики для цього авто." });
    }
  } catch (error) {
    console.error("Помилка AI-пошуку:", error);
    res
      .status(500)
      .json({ message: "Сталася помилка при AI-пошуку характеристик." });
  }
};

// ✅ Отримання сторінки з Wikipedia
exports.scrapeCarSpecs = async (req, res) => {
  const { make, model, year } = req.query;
  console.log("🔵 Отримано запит:", { make, model, year });

  let url = `https://en.wikipedia.org/wiki/${make}_${model}`;
  if (year) {
    url += `_${year}`;
  }

  console.log("🌍 Відкривається сторінка:", url);
  return res.json({ wikipediaUrl: url });
};

// ✅ Отримання характеристик з AUTO.RIA
exports.getAutoRiaSpecs = async (req, res) => {
  try {
    const { make, model, year, carId, createdBy } = req.query;
    console.log("🔵 Отримано запит на авто:", { make, model, year, carId });

    if (!make || !model || !year || !carId) {
      return res.status(400).json({ error: "Відсутні необхідні параметри" });
    }

    // 1️⃣ Перевіряємо наявність кешу в MongoDB
    const existingSpecs = await CarSpecs.findOne({ carId, source: "auto-ria" });
    if (existingSpecs) {
      const timeDiff = Date.now() - existingSpecs.createdAt.getTime();
      if (timeDiff < CACHE_EXPIRATION) {
        console.log("✅ Дані взято з кешу");
        return res.json(existingSpecs);
      }
    }

    const API_KEY = process.env.AUTO_RIA_API_KEY;

    // 2️⃣ Отримуємо ID виробника
    console.log("🔍 Пошук ID виробника...");
    const markaResponse = await axios.get(
      `https://developers.ria.com/auto/categories/1/marks?api_key=${API_KEY}`
    );
    const marka = markaResponse.data.find(
      (m) => m.name.toLowerCase() === make.toLowerCase()
    );

    if (!marka) {
      console.error("❌ Виробник не знайдений:", make);
      return res.status(404).json({ error: "Виробник не знайдений" });
    }

    console.log(`✅ ID виробника (${make}):`, marka.value);

    // 3️⃣ Отримуємо ID моделі
    console.log("🔍 Пошук ID моделі...");
    const modelResponse = await axios.get(
      `https://developers.ria.com/auto/categories/1/marks/${marka.value}/models?api_key=${API_KEY}`
    );
    const modelData = modelResponse.data.find(
      (m) => m.name.toLowerCase() === model.toLowerCase()
    );

    if (!modelData) {
      console.error("❌ Модель не знайдена:", model);
      return res.status(404).json({ error: "Модель не знайдена" });
    }

    console.log(`✅ ID моделі (${model}):`, modelData.value);

    // 4️⃣ Виконуємо пошук авто
    console.log("🔍 Виконуємо пошук авто на AUTO.RIA...");
    const searchUrl = `https://developers.ria.com/auto/search?api_key=${API_KEY}&marka_id=${marka.value}&model_id=${modelData.value}&yers=${year}&category_id=1`;

    const searchResponse = await axios.get(searchUrl);

    if (!searchResponse.data.result.search_result.ids.length) {
      console.log("❌ Авто не знайдено");
      return res.status(404).json({ error: "Авто не знайдено" });
    }

    const autoId = searchResponse.data.result.search_result.ids[0];
    console.log("🚗 Знайдено авто, ID:", autoId);

    // 5️⃣ Отримуємо характеристики авто
    console.log("📥 Отримуємо характеристики авто...");
    const autoDetailsUrl = `https://developers.ria.com/auto/info?api_key=${API_KEY}&auto_id=${autoId}`;
    const detailsResponse = await axios.get(autoDetailsUrl);

    if (!detailsResponse.data) {
      console.error("❌ Дані про авто не отримано");
      return res
        .status(500)
        .json({ error: "Помилка отримання характеристик авто" });
    }

    const autoData = detailsResponse.data;

    // 6️⃣ Зберігаємо характеристики в базу
    const specs = new CarSpecs({
      carId,
      createdBy,
      source: "auto-ria",
      fuelType: autoData.fuelNameUa || "невідомо",
      combustionEngine: autoData.engine_capacity
        ? {
            engineDisplacement: autoData.engine_capacity,
            horsepower: autoData.auto_power,
            torque: autoData.auto_torque,
            fuelConsumption: autoData.fuelConsumption,
            transmission: autoData.gearboxTypeName,
          }
        : null,
      electric:
        autoData.fuelNameUa === "електро"
          ? {
              batteryCapacity: autoData.battery_capacity,
              range: autoData.range,
              electricMotorPower: autoData.auto_power,
              chargeTime: autoData.charge_time,
              chargePort: autoData.charge_port,
            }
          : null,
      additionalSpecs: {
        doors: autoData.auto_door,
        seats: autoData.auto_seat,
      },
    });

    await specs.save();
    console.log("✅ Збережено в MongoDB");

    res.json(specs);
  } catch (error) {
    console.error("❌ Помилка сервера:", error.message || error);
    if (error.response) {
      console.error(
        "🔥 Відповідь сервера:",
        error.response.status,
        error.response.data
      );
      return res
        .status(error.response.status)
        .json({ error: error.response.data });
    }
    res.status(500).json({ error: "Помилка під час обробки запиту" });
  }
};
