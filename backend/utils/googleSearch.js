const axios = require("axios");
require("dotenv").config();

const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY; // Використовуємо правильний ключ з .env
const GOOGLE_SEARCH_CX = process.env.GOOGLE_SEARCH_CX;
console.log("API Key:", process.env.GOOGLE_CUSTOM_SEARCH_API_KEY);
console.log("CX ID:", process.env.GOOGLE_SEARCH_CX);

// Функція для пошуку характеристик авто через GCS
const googleSearchCarSpecs = async (query) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1`,
      {
        params: {
          key: GOOGLE_SEARCH_API_KEY, // Ваш API-ключ
          cx: GOOGLE_SEARCH_CX, // Ваш Search Engine ID
          q: query, // Запит для пошуку
        },
      }
    );

    return response.data.items || []; // Повертаємо результати пошуку
  } catch (error) {
    console.error("Помилка пошуку через Google Cloud Search:", error);
    return [];
  }
};

module.exports = { googleSearchCarSpecs };
