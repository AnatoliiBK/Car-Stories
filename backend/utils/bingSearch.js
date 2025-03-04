const axios = require("axios");
const BING_API_KEY = "ВАШ_КЛЮЧ";
const BING_SEARCH_URL = "https://api.bing.microsoft.com/v7.0/search";

async function bingSearchCarSpecs(make, model, year) {
  try {
    const query = `${make} ${model} ${year} технічні характеристики`;
    const response = await axios.get(BING_SEARCH_URL, {
      headers: { "Ocp-Apim-Subscription-Key": BING_API_KEY },
      params: { q: query, count: 5 },
    });

    const results = response.data.webPages?.value || [];

    // Фільтруємо лише офіційні сайти
    return results.filter(
      (page) => page.url.includes("bmw.com") || page.url.includes("official")
    );
  } catch (error) {
    console.error("Помилка Bing-пошуку:", error);
    return [];
  }
}

module.exports = bingSearchCarSpecs;
