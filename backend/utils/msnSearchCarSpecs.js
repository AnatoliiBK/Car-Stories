const axios = require("axios");

const msnSearchFunction = async (make, model, year) => {
  const query = `${make} ${model} ${year} site:autos.msn.com`;
  const subscriptionKey = process.env.BING_API_KEY;
  const endpoint = "https://api.bing.microsoft.com/v7.0/search";

  try {
    const response = await axios.get(endpoint, {
      headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
      params: { q: query, count: 10 },
    });

    const results = response.data.webPages?.value || [];
    return results.map((result) => ({
      title: result.name,
      url: result.url,
    }));
  } catch (error) {
    console.error("Помилка MSN (через Bing) пошуку:", error);
    return [];
  }
};

module.exports = { msnSearchFunction };
