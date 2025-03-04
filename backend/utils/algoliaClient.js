const { algoliasearch } = require("algoliasearch");
require("dotenv").config();

const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME } = process.env;

if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY || !ALGOLIA_INDEX_NAME) {
  throw new Error("❌ Відсутні необхідні змінні середовища для Algolia");
}

// Ініціалізація клієнта Algolia
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
const carSpecsIndex = client.initIndex(ALGOLIA_INDEX_NAME);

module.exports = carSpecsIndex;
