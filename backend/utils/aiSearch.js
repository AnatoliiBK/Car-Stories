require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function aiSearchFunction(make, model, year) {
  try {
    const prompt = `Надай детальні технічні характеристики автомобіля ${make} ${model} ${year}. Вкажи тип пального, потужність, крутний момент, трансмісію, ємність батареї (якщо електро), запас ходу і інші важливі параметри, базуючись на офіційних даних виробника.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2, // Робимо відповідь максимально точною
    });

    const aiText = response.choices[0]?.message?.content;

    if (!aiText) throw new Error("AI не повернув відповідь");

    // Парсимо отриману відповідь у вигляді JSON-об'єкта
    const aiSpecs = JSON.parse(aiText);

    return aiSpecs;
  } catch (error) {
    console.error("Помилка отримання характеристик через AI:", error);
    return null;
  }
}

module.exports = { aiSearchFunction };

// const OpenAI = require("openai");

// // Ініціалізація OpenAI API
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // API-ключ повинен бути у змінних середовища
// });

// async function aiSearchFunction(make, model, year) {
//   try {
//     // Формуємо запит до AI
//     const prompt = `Дай мені основні технічні характеристики для автомобіля ${make} ${model} ${year}.
//     Вкажи тип пального, потужність (horsepower), крутний момент (torque), коробку передач (transmission),
//     об'єм двигуна (engine displacement) для ДВЗ, ємність батареї (battery capacity) для електромобілів,
//     запас ходу (electric range) для електромобілів.`;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//     });

//     const aiText = response.choices[0].message.content;

//     // Парсимо відповідь у формат об'єкта
//     const carSpecs = parseAiResponse(aiText);

//     return carSpecs;
//   } catch (error) {
//     console.error("Помилка при запиті до AI:", error);
//     return null;
//   }
// }

// // Функція для парсингу відповіді AI
// function parseAiResponse(aiText) {
//   const specs = {};

//   if (aiText.includes("бензин")) specs.fuelType = "бензин";
//   if (aiText.includes("дизель")) specs.fuelType = "дизель";
//   if (aiText.includes("гібрид")) specs.fuelType = "гібрид";
//   if (aiText.includes("електро")) specs.fuelType = "електро";

//   const matchHorsepower = aiText.match(/потужність: (\d+) к.с./);
//   if (matchHorsepower) specs.horsepower = parseInt(matchHorsepower[1]);

//   const matchTorque = aiText.match(/крутний момент: (\d+) Нм/);
//   if (matchTorque) specs.torque = parseInt(matchTorque[1]);

//   const matchTransmission = aiText.match(/коробка передач: (.+)/);
//   if (matchTransmission) specs.transmission = matchTransmission[1];

//   const matchEngineDisplacement = aiText.match(/об'єм двигуна: (\d+.\d+) л/);
//   if (matchEngineDisplacement)
//     specs.engineDisplacement = parseFloat(matchEngineDisplacement[1]);

//   const matchBatteryCapacity = aiText.match(/ємність батареї: (\d+) кВт·год/);
//   if (matchBatteryCapacity)
//     specs.batteryCapacity = parseInt(matchBatteryCapacity[1]);

//   const matchElectricRange = aiText.match(/запас ходу: (\d+) км/);
//   if (matchElectricRange) specs.electricRange = parseInt(matchElectricRange[1]);

//   return specs;
// }

// module.exports = aiSearchFunction;
