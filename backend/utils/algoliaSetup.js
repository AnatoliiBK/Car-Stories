const { algoliasearch } = require("algoliasearch"); // Виправлено імпорт
require("dotenv").config();

const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME } = process.env;
console.log("APP ID : ", ALGOLIA_APP_ID);
console.log("API KEY : ", ALGOLIA_API_KEY);
console.log("INDEX NAME : ", ALGOLIA_INDEX_NAME);

if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY) {
  throw new Error(
    "❌ Відсутні ALGOLIA_APP_ID або ALGOLIA_API_KEY у .env файлі"
  );
}

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

// Ініціалізація індексу
const index = client.initIndex(ALGOLIA_INDEX_NAME);

async function createIndex() {
  if (!ALGOLIA_INDEX_NAME) {
    throw new Error("❌ Відсутнє ALGOLIA_INDEX_NAME у .env файлі");
  }

  try {
    // Налаштування індексу
    await index.setSettings({
      searchableAttributes: ["make", "model", "year"], // атрибути для пошуку
      attributesForFaceting: ["fuelType"], // атрибути для фільтрації
    });

    console.log(`✅ Індекс '${ALGOLIA_INDEX_NAME}' успішно створено`);

    // Додаємо об'єкти до індексу (як приклад)
    const carSpecs = [
      {
        objectID: 1,
        make: "BMW",
        model: "i8",
        year: 2021,
        fuelType: "electric",
      },
      {
        objectID: 2,
        make: "Tesla",
        model: "Model S",
        year: 2020,
        fuelType: "electric",
      },
    ];

    const response = await index.saveObjects(carSpecs);
    console.log("Об'єкти успішно додано до індексу:", response);
  } catch (error) {
    console.error("❌ Помилка створення або налаштування індексу:", error);
  }
}

createIndex();

// const algoliasearch = require("algoliasearch");
// require("dotenv").config();

// const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME } = process.env;

// if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY) {
//   throw new Error("❌ Відсутні ALGOLIA_APP_ID або ALGOLIA_API_KEY у .env файлі");
// }

// const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

// // Якщо індекс ще не створений, створюємо його
// async function createIndex() {
//   if (!ALGOLIA_INDEX_NAME) {
//     throw new Error("❌ Відсутнє ALGOLIA_INDEX_NAME у .env файлі");
//   }

//   const index = client.initIndex(ALGOLIA_INDEX_NAME);

//   try {
//     // Визначаємо схему даних для індексу
//     await index.setSettings({
//       searchableAttributes: ["make", "model", "year"],
//       attributesForFaceting: ["fuelType"],
//     });

//     console.log(`✅ Індекс '${ALGOLIA_INDEX_NAME}' успішно створено`);
//   } catch (error) {
//     console.error("❌ Помилка створення індексу:", error);
//   }
// }

// createIndex();
