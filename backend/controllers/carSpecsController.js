const CarSpecs = require("../models/CarSpecsSchema");
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

// exports.msnSearchCarSpecs = async (req, res) => {
//   const { make, model, year, carId } = req.body;

//   try {
//     const msnResults = await msnSearchFunction(make, model, year);

//     if (msnResults && msnResults.length > 0) {
//       const carSpecs = new CarSpecs({
//         carId,
//         source: "msn",
//         usefulLinks: msnResults.map((result) => ({
//           title: result.title,
//           url: result.url,
//         })),
//         additionalSpecs: {
//           description: `Дані отримані через MSN (site:autos.msn.com) для ${make} ${model} ${year}`,
//         },
//       });

//       await carSpecs.save();
//       res
//         .status(200)
//         .json({ message: "MSN-результати успішно збережені!", carSpecs });
//     } else {
//       res
//         .status(404)
//         .json({ message: "MSN не знайшов характеристик для цього авто." });
//     }
//   } catch (error) {
//     console.error("Помилка MSN-пошуку:", error);
//     res.status(500).json({ message: "Сталася помилка при пошуку через MSN." });
//   }
// };

exports.msnSearchCarSpecs = async (req, res) => {
  const { make, model, year, carId } = req.body;

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

// const parseCarSpecs = async (url) => {
//   try {
//     console.log("URL IN PARCE : ", url);
//     const response = await axios.get(url);
//     const $ = cheerio.load(response.data); // Завантажуємо HTML

//     // Приклад: парсимо тип палива
//     const fuelType = $("selector-for-fuel-type").text(); // Замість 'selector-for-fuel-type' вставте правильний CSS-селектор для типу палива

//     // Приклад: парсимо об'єм двигуна
//     const engineDisplacement = $("selector-for-engine-displacement").text(); // Замість 'selector-for-engine-displacement' вставте правильний CSS-селектор для об'єму двигуна

//     // Інші характеристики
//     const horsepower = $("selector-for-horsepower").text();
//     const torque = $("selector-for-torque").text();
//     const fuelConsumption = $("selector-for-fuel-consumption").text();
//     const transmission = $("selector-for-transmission").text();

//     return {
//       fuelType,
//       combustionEngine: {
//         engineDisplacement,
//         horsepower,
//         torque,
//         fuelConsumption,
//         transmission,
//       },
//     };
//   } catch (error) {
//     console.error("Помилка при парсингу:", error);
//     return null;
//   }
// };

// Кешування даних (наприклад, на 24 години)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// ✅ Додавання характеристик у базу
exports.addCarSpecs = async (req, res) => {
  try {
    const specs = new CarSpecs(req.body);
    await specs.save();
    res.status(201).json(specs);
  } catch (error) {
    res.status(500).json({ error: "Не вдалося додати характеристики авто" });
  }
};

// ✅ Отримання характеристик з бази
exports.getCarSpecs = async (req, res) => {
  try {
    const specs = await CarSpecs.findOne({ carId: req.params.carId });
    if (!specs) {
      return res.status(404).json({ message: "Характеристики не знайдено" });
    }
    res.json(specs);
  } catch (error) {
    res.status(500).json({ error: "Помилка отримання характеристик авто" });
  }
};

// // AI-пошук технічних характеристик
// exports.aiSearchCarSpecs = async (req, res) => {
//   try {
//     const { make, model, year, carId } = req.query;

//     if (!make || !model || !year || !carId) {
//       return res.status(400).json({ error: "Відсутні необхідні параметри" });
//     }

//     console.log("🔎 AI-пошук характеристик для:", { make, model, year });

//     // Симуляція запиту до AI (замінити на реальний пошук)
//     const aiSpecs = {
//       fuelType: "бензин",
//       combustionEngine: {
//         engineDisplacement: 2998,
//         horsepower: 375,
//         torque: 500,
//         fuelConsumption: 9.0,
//         transmission: "Автоматична",
//       },
//       source: "AI", // Додаємо значення для поля source
//     };

//     // Збереження знайдених характеристик у базу
//     const specs = new CarSpecs({ carId, ...aiSpecs });
//     await specs.save();

//     res.json(specs);
//   } catch (error) {
//     console.error("❌ Помилка AI-пошуку:", error);
//     res.status(500).json({ error: "Помилка отримання характеристик" });
//   }
// };

// Функція для отримання даних з GCS і NHTSA
// exports.getCarSpecsFromGCS = async (req, res) => {
//   try {
//     const { carId, make, model, year, vin } = req.body;

//     // Перевірка необхідних параметрів
//     if (!carId || (!vin && (!make || !model || !year))) {
//       return res
//         .status(400)
//         .json({ error: "Потрібен carId і VIN або make, model, year" });
//     }

//     // Перевіряємо наявність даних у кеші
//     let existingSpecs = await CarSpecs.findOne({ carId, source: "nhtsa" });
//     if (existingSpecs) {
//       console.log("✅ Характеристики отримано з кешу");
//       return res.status(200).json({
//         message: "Характеристики отримано з кешу",
//         carSpecs: existingSpecs,
//       });
//     }

//     // 🔍 Отримуємо корисні посилання з GCS
//     const results = await googleSearchCarSpecs(`${make} ${model} ${year}`);
//     const usefulLinks = results.length
//       ? results.map((item) => ({
//           title: item.title,
//           url: item.link,
//         }))
//       : [];

//     // 🔍 Отримуємо технічні характеристики з NHTSA API
//     const nhtsaSpecs = await nhtsaSearchCarSpecs({ vin, make, model, year });
//     if (!nhtsaSpecs) {
//       // Якщо NHTSA не дало результатів, зберігаємо лише посилання
//       const newCarSpecs = new CarSpecs({
//         carId,
//         source: "gcs", // Джерело лише GCS, якщо NHTSA не знайдено
//         usefulLinks,
//       });
//       await newCarSpecs.save();
//       return res.status(200).json({
//         message:
//           "Технічні характеристики не знайдено, збережено лише посилання",
//         carSpecs: newCarSpecs,
//       });
//     }

//     // Збереження у базу MongoDB з даними з NHTSA
//     const newCarSpecs = new CarSpecs({
//       carId,
//       source: "nhtsa", // Джерело — NHTSA, оскільки додаємо його дані
//       usefulLinks,
//       ...nhtsaSpecs, // Розпаковуємо характеристики з NHTSA
//     });

//     await newCarSpecs.save();
//     console.log("✅ Дані збережено в MongoDB");

//     res.status(200).json({
//       message: "Характеристики додано",
//       carSpecs: newCarSpecs,
//     });
//   } catch (error) {
//     console.error("❌ Помилка в getCarSpecsFromGCS:", error.message);
//     res.status(500).json({ error: "Помилка сервера" });
//   }
// };

// Функція для отримання даних з GCS і NHTSA
exports.getCarSpecsFromGCS = async (req, res) => {
  try {
    const { carId, make, model, year, vin } = req.body;

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

// // Функція для отримання даних з GCS
// exports.getCarSpecsFromGCS = async (req, res) => {
//   try {
//     const { carId, make, model, year } = req.body;

//     if (!carId || !make || !model || !year) {
//       return res
//         .status(400)
//         .json({ error: "Необхідні carId, make, model, і year" });
//     }

//     // // Логіка пошуку характеристик через GCS...
//     // const results = await googleSearchCarSpecs(`${make} ${model} ${year}`);

//     // if (results.length === 0) {
//     //   return res.status(404).json({ error: "Не знайдено інформації" });
//     // }

//     // let carSpecs = null;
//     // for (let i = 0; i < results.length; i++) {
//     //   const specs = await parseCarSpecs(results[i].link);
//     //   if (specs) {
//     //     carSpecs = specs; // Якщо знайшли характеристики, зберігаємо
//     //     break; // Виходимо з циклу, коли знайшли потрібні характеристики
//     //   }
//     // }

//     // // Тут ми більше не перевіряємо на carSpecs, оскільки хочемо зберегти навіть пусті дані, якщо нічого не знайдено

//     // // Корисні посилання
//     // const usefulLinks = results.map((item) => ({
//     //   title: item.title,
//     //   url: item.link,
//     // }));
//     // 🔍 Отримуємо корисні посилання з GCS
//     const results = await googleSearchCarSpecs(`${make} ${model} ${year}`);

//     // Якщо посилання не знайдено
//     const usefulLinks = results.length
//       ? results.map((item) => ({
//           title: item.title,
//           url: item.link,
//         }))
//       : [];

//     // 🔍 Отримуємо технічні характеристики з NHTSA API
//     const carSpecs = await nhtsaSearchCarSpecs(make, model, year);

//     if (!carSpecs) {
//       return res.status(404).json({
//         error: "Не знайдено технічних характеристик в NHTSA API",
//         usefulLinks, // Все одно повертаємо корисні посилання
//       });
//     }

//     // Збереження у базу MongoDB, навіть якщо carSpecs порожнє
//     const newCarSpecs = new CarSpecs({
//       carId,
//       source: "gcs",
//       usefulLinks,
//       ...carSpecs, // Додаємо характеристики, якщо вони є
//     });

//     await newCarSpecs.save();

//     res
//       .status(200)
//       .json({ message: "Характеристики додано", carSpecs: newCarSpecs });
//   } catch (error) {
//     console.error("Помилка отримання даних з GCS:", error);
//     res.status(500).json({ error: "Помилка сервера" });
//   }
// };
// exports.getCarSpecsFromGCS = async (req, res) => {
//   try {
//     const { carId, make, model, year } = req.body;

//     if (!carId || !make || !model || !year) {
//       return res
//         .status(400)
//         .json({ error: "Необхідні carId, make, model, і year" });
//     }

//     // Логіка пошуку характеристик через GCS...
//     const results = await googleSearchCarSpecs(`${make} ${model} ${year}`);

//     if (results.length === 0) {
//       return res.status(404).json({ error: "Не знайдено інформації" });
//     }

//     // Приклад додаткових характеристик
//     const additionalSpecs = {
//       exampleSpec: "Дані з GCS",
//     };

//     const usefulLinks = results.map((item) => ({
//       title: item.title,
//       url: item.link,
//     }));

//     // Збереження у базу MongoDB
//     const carSpecs = new CarSpecs({
//       carId,
//       source: "gcs",
//       additionalSpecs,
//       usefulLinks,
//     });

//     await carSpecs.save();

//     res.status(200).json({ message: "Характеристики додано", carSpecs });
//   } catch (error) {
//     console.error("Помилка отримання даних з GCS:", error);
//     res.status(500).json({ error: "Помилка сервера" });
//   }
// };

// exports.getCarSpecsFromGCS = async (req, res) => {
//   try {
//     const { carId, query } = req.body;

//     if (!carId || !query) {
//       return res.status(400).json({ error: "Необхідні carId і query" });
//     }

//     // Викликаємо функцію пошуку через GCS
//     const results = await googleSearchCarSpecs(query);

//     if (results.length === 0) {
//       return res.status(404).json({ error: "Не знайдено інформації" });
//     }

//     // Отримуємо корисні посилання
//     const usefulLinks = results.map((item) => ({
//       title: item.title,
//       url: item.link,
//     }));

//     // Додаткові характеристики (сюди можна додати логіку парсингу)
//     const additionalSpecs = {
//       exampleSpec: "Дані з GCS",
//     };

//     // Збереження в MongoDB
//     const carSpecs = new CarSpecs({
//       carId,
//       source: "gcs",
//       additionalSpecs,
//       usefulLinks,
//     });

//     await carSpecs.save();

//     res.status(200).json({ message: "Характеристики додані", carSpecs });
//   } catch (error) {
//     console.error("Помилка отримання даних з GCS:", error);
//     res.status(500).json({ error: "Помилка сервера" });
//   }
// };

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
  const { make, model, year, carId } = req.body;

  try {
    const bingResults = await bingSearchFunction(make, model, year);

    if (bingResults && bingResults.length > 0) {
      const carSpecs = new CarSpecs({
        carId,
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
  const { make, model, year, carId } = req.body;

  try {
    // Викликаємо AI для пошуку характеристик
    const aiResponse = await aiSearchFunction(make, model, year);

    if (aiResponse) {
      const carSpecs = new CarSpecs({
        carId,
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
    const { make, model, year, carId } = req.query;
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

// exports.searchCarOnAutoRia = async (req, res) => {
//   const { make, model, year } = req.query;
//   console.log("🔵 Пошук авто:", { make, model, year });

//   if (!AUTO_RIA_API_KEY) {
//     return res
//       .status(500)
//       .json({ error: "❌ API-ключ для AUTO.RIA не знайдено!" });
//   }

//   try {
//     // 🔹 Крок 1: Отримуємо ID бренду (marka_id)
//     const marksUrl = `https://developers.ria.com/auto/categories/1/marks?api_key=${AUTO_RIA_API_KEY}`;
//     const marksResponse = await axios.get(marksUrl);
//     const brand = marksResponse.data.find(
//       (b) => b.name.toLowerCase() === make.toLowerCase()
//     );

//     if (!brand) {
//       return res
//         .status(404)
//         .json({ error: `❌ Виробник '${make}' не знайдений!` });
//     }

//     const marka_id = brand.value;
//     console.log(`✅ ID виробника (${make}):`, marka_id);

//     // 🔹 Крок 2: Отримуємо ID моделі (model_id)
//     const modelsUrl = `https://developers.ria.com/auto/categories/1/marks/${marka_id}/models?api_key=${AUTO_RIA_API_KEY}`;
//     const modelsResponse = await axios.get(modelsUrl);
//     const carModel = modelsResponse.data.find(
//       (m) => m.name.toLowerCase() === model.toLowerCase()
//     );

//     if (!carModel) {
//       return res.status(404).json({
//         error: `❌ Модель '${model}' не знайдена у виробника '${make}'!`,
//       });
//     }

//     const model_id = carModel.value;
//     console.log(`✅ ID моделі (${model}):`, model_id);

//     // 🔹 Крок 3: Пошук авто за параметрами
//     const searchUrl = `https://developers.ria.com/auto/search?api_key=${AUTO_RIA_API_KEY}&marka_id=${marka_id}&model_id=${model_id}&yers=${year}&category_id=1`;
//     console.log("🔍 Виконуємо пошук за URL:", searchUrl);

//     const searchResponse = await axios.get(searchUrl);

//     if (!searchResponse.data.result.search_result.ids.length) {
//       return res
//         .status(404)
//         .json({ error: "❌ Авто не знайдено за заданими параметрами!" });
//     }

//     // Беремо перший результат
//     const carId = searchResponse.data.result.search_result.ids[0];
//     console.log("🚗 Знайдено авто, ID:", carId);

//     // 🔹 Крок 4: Отримуємо характеристики знайденого авто
//     const carDetailsUrl = `https://developers.ria.com/auto/info?api_key=${AUTO_RIA_API_KEY}&auto_id=${carId}`;
//     const carDetailsResponse = await axios.get(carDetailsUrl);

//     res.json(carDetailsResponse.data);
//   } catch (error) {
//     console.error("❌ Помилка пошуку авто:", error.message);
//     res.status(500).json({ error: "Помилка під час пошуку авто." });
//   }
// };

// // ✅ Парсинг характеристик з Wikipedia
// exports.scrapeCarSpecs = async (req, res) => {
//   const { make, model, year } = req.query;
//   console.log("🔵 Отримано запит на парсинг:", req.query);
//   console.log("🔵 Отримано запит:", { make, model, year });

//   try {
//     let url = `https://en.wikipedia.org/wiki/${make}_${model}`;
//     if (year) {
//       url += `_${year}`;
//     }
//     console.log("Отримуємо сторінку:", url);
//     console.log("🌍 Формується запит до:", url);

//     let { data } = await axios.get(url, {
//       headers: { "User-Agent": "Mozilla/5.0" }, // Додаємо User-Agent, щоб обійти блокування
//     });

//     console.log("🟢 HTML отримано, довжина:", data.length);
//     console.log("🔍 Перші 500 символів:", data.slice(0, 500));

//     // let { data } = await axios.get(url);
//     // console.log("HTML сторінки:", data.slice(0, 500)); // Виведе перші 500 символів HTML

//     let $ = cheerio.load(data);

//     let specifications = {};
//     const tableExists = $("table.infobox").length > 0;
//     console.log("Таблиця знайдена?", tableExists);

//     console.log("HTML таблиці:", $("table.infobox").html());

//     if (!$("table.infobox").length) {
//       console.error("Таблиця характеристик не знайдена!");
//       return res
//         .status(404)
//         .json({ error: "Таблиця характеристик не знайдена." });
//     }

//     $("table.infobox tr").each((index, element) => {
//       const key = $(element).find("th").text().trim();
//       // const value = $(element).find("td").text().trim();
//       const value = $(element)
//         .find("td")
//         .text()
//         .replace(/\[.*?\]/g, "")
//         .trim();
//       console.log(`🔹 ${key}: ${value}`); // Вивід характеристик

//       if (key && value) {
//         specifications[key] = value;
//       }
//     });

//     // Якщо характеристики не знайдено, пробуємо без року
//     if (Object.keys(specifications).length === 0 && year) {
//       console.warn(`Сторінка ${url} не знайдена, пробуємо без року...`);
//       url = `https://en.wikipedia.org/wiki/${make}_${model}`;
//       data = (await axios.get(url)).data;
//       $ = cheerio.load(data);

//       $("table.infobox tr").each((index, element) => {
//         const key = $(element).find("th").text().trim();
//         const value = $(element).find("td").text().trim();

//         if (key && value) {
//           specifications[key] = value;
//         }
//       });
//     }

//     if (Object.keys(specifications).length === 0) {
//       return res.status(404).json({ error: "Характеристики не знайдено." });
//     }

//     console.log("Отримані характеристики:", specifications);

//     res.json(specifications);
//   } catch (error) {
//     console.error("Помилка парсингу:", error.message);
//     res.status(500).json({ error: "Помилка під час отримання характеристик." });
//   }
// };

// exports.scrapeCarSpecs = async (req, res) => {
//   const { make, model, year } = req.query;

//   if (!make || !model) {
//     return res.status(400).json({ error: "Марка і модель обов’язкові" });
//   }

//   try {
//     // Формуємо URL для Wikipedia з урахуванням року випуску
//     let url = `https://en.wikipedia.org/wiki/${make}_${model}`;
//     if (year) {
//       url += `_${year}`; // Додаємо рік, якщо він вказаний
//     }

//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     const specifications = {};

//     // Парсимо характеристики з таблиці
//     $("table.infobox tr").each((index, element) => {
//       const key = $(element).find("th").text().trim();
//       const value = $(element).find("td").text().trim();
//       if (key && value) {
//         specifications[key] = value;
//       }
//     });

//     if (Object.keys(specifications).length === 0) {
//       return res.status(404).json({ error: "Дані не знайдено" });
//     }

//     res.json(specifications);
//   } catch (error) {
//     console.error("Помилка парсингу:", error.message);
//     res.status(500).json({ error: "Не вдалося отримати характеристики" });
//   }
// };

// const CarSpecs = require("../models/CarSpecsSchema");

// exports.addCarSpecs = async (req, res) => {
//   try {
//     const specs = new CarSpecs(req.body);
//     await specs.save();
//     res.status(201).json(specs);
//   } catch (error) {
//     res.status(500).json({ error: "Не вдалося додати характеристики авто" });
//   }
// };

// exports.getCarSpecs = async (req, res) => {
//   try {
//     const specs = await CarSpecs.findOne({ carId: req.params.carId });
//     if (!specs) {
//       return res.status(404).json({ message: "Характеристики не знайдено" });
//     }
//     res.json(specs);
//   } catch (error) {
//     res.status(500).json({ error: "Помилка отримання характеристик авто" });
//   }
// };
