const { algoliasearch } = require("algoliasearch"); // Імпорт v5
require("dotenv").config();

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);
const indexName = process.env.ALGOLIA_INDEX_NAME;

async function algoliaSearchCarSpecs(make, model, year) {
  try {
    const response = await client.searchSingleIndex({
      indexName,
      searchParams: {
        query: `${make} ${model} ${year}`,
      },
    });

    if (response.hits.length === 0) {
      return null; // Нічого не знайдено
    }

    return response.hits[0]; // Повертаємо перший результат
  } catch (error) {
    console.error("❌ Помилка пошуку в Algolia:", error);
    return null;
  }
}

module.exports = { algoliaSearchCarSpecs };

// const { algoliasearch } = require("algoliasearch"); // Імпорт Algolia SDK
// require("dotenv").config();

// // Отримуємо налаштування з .env
// const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME } = process.env;

// if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY || !ALGOLIA_INDEX_NAME) {
//   throw new Error(
//     "❌ Відсутні ALGOLIA_APP_ID, ALGOLIA_API_KEY або ALGOLIA_INDEX_NAME у .env файлі"
//   );
// }

// // Ініціалізуємо клієнта та індекс
// const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
// const index = client.initIndex(ALGOLIA_INDEX_NAME);

// /**
//  * Функція для пошуку характеристик авто в Algolia
//  * @param {string} make - Марка автомобіля (наприклад, "BMW")
//  * @param {string} model - Модель автомобіля (наприклад, "X5")
//  * @param {number} year - Рік випуску (наприклад, 2021)
//  * @returns {Promise<Object|null>} - Об'єкт характеристик авто або null, якщо не знайдено
//  */
// async function algoliaSearchCarSpecs(make, model, year) {
//   try {
//     const query = `${make} ${model} ${year}`; // Формуємо запит
//     const { hits } = await index.search(query); // Шукаємо в Algolia

//     if (hits.length === 0) {
//       console.log(`❌ Характеристики для ${make} ${model} ${year} не знайдено`);
//       return null;
//     }

//     console.log(
//       `✅ Знайдено ${hits.length} збіг(ів) для ${make} ${model} ${year}`
//     );
//     return hits[0]; // Повертаємо перший знайдений результат
//   } catch (error) {
//     console.error("❌ Помилка пошуку в Algolia:", error);
//     return null;
//   }
// }

// module.exports = { algoliaSearchCarSpecs };

// const { algoliasearch } = require("algoliasearch");

// const client = algoliasearch("YourApplicationID", "YourSearchOnlyAPIKey");
// const index = client.initIndex("cars"); // Використовуйте правильну назву індексу

// // Функція для отримання характеристик з Algolia
// const algoliaSearchCarSpecs = async (make, model, year) => {
//   try {
//     const searchQuery = `${make} ${model} ${year}`;
//     const searchResults = await index.search(searchQuery);

//     if (searchResults.hits.length === 0) {
//       return null; // Немає результатів
//     }

//     // Вибираємо перший результат або необхідні характеристики
//     const carData = searchResults.hits[0];
//     return {
//       fuelType: carData.fuelType || "бензин",
//       combustionEngine: {
//         engineDisplacement: carData.engineDisplacement || 0,
//         horsepower: carData.horsepower || 0,
//         torque: carData.torque || 0,
//         fuelConsumption: carData.fuelConsumption || 0,
//         transmission: carData.transmission || "невідомо",
//       },
//     };
//   } catch (error) {
//     console.error("Помилка при отриманні даних з Algolia:", error);
//     return null;
//   }
// };

// module.exports = { algoliaSearchCarSpecs };
