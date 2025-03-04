const axios = require("axios");
const cheerio = require("cheerio");

const getCarSpecs = async (make, model, year = "") => {
  try {
    let url = `https://en.wikipedia.org/wiki/${make}_${model}`;

    // Якщо передано рік, додаємо його до URL
    if (year) {
      url += `_${year}`;
    }

    let { data } = await axios.get(url);
    let $ = cheerio.load(data);

    let specifications = {};

    // Парсимо таблицю характеристик
    $("table.infobox tr").each((index, element) => {
      const key = $(element).find("th").text().trim();
      const value = $(element).find("td").text().trim();

      if (key && value) {
        specifications[key] = value;
      }
    });

    // Якщо характеристики порожні, пробуємо без року
    if (Object.keys(specifications).length === 0 && year) {
      console.warn(`Сторінка ${url} не знайдена, пробуємо без року...`);
      url = `https://en.wikipedia.org/wiki/${make}_${model}`;
      data = (await axios.get(url)).data;
      $ = cheerio.load(data);

      $("table.infobox tr").each((index, element) => {
        const key = $(element).find("th").text().trim();
        const value = $(element).find("td").text().trim();

        if (key && value) {
          specifications[key] = value;
        }
      });
    }

    if (Object.keys(specifications).length === 0) {
      console.warn("Характеристики не знайдено!");
      return null;
    }

    return specifications;
  } catch (error) {
    console.error("Помилка парсингу:", error.message);
    return null;
  }
};

module.exports = getCarSpecs;
