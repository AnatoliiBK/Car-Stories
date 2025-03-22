// const axios = require("axios");

// const NHTSA_API_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

// const nhtsaSearchCarSpecs = async ({ vin, make, model, year }) => {
//   try {
//     let carData;

//     if (vin) {
//       // Пошук за VIN
//       console.log(`🔍 Пошук за VIN: ${vin} через NHTSA API...`);
//       const response = await axios.get(
//         `${NHTSA_API_URL}/DecodeVinValues/${vin}?format=json`
//       );

//       if (response.data.Results && response.data.Results.length > 0) {
//         carData = response.data.Results[0];
//         if (carData.ErrorCode !== "0") {
//           console.error(`❌ Помилка NHTSA API: ${carData.ErrorText}`);
//           return null;
//         }
//       } else {
//         console.error("❌ Дані за VIN не знайдено");
//         return null;
//       }
//     } else if (make && model && year) {
//       // Пошук за make, model, year
//       console.log(
//         `🔍 Пошук за Make: ${make}, Model: ${model}, Year: ${year}...`
//       );
//       const response = await axios.get(
//         `${NHTSA_API_URL}/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`
//       );

//       if (response.data.Results && response.data.Results.length > 0) {
//         carData = response.data.Results.find(
//           (item) => item.Model_Name.toLowerCase() === model.toLowerCase()
//         );

//         if (!carData) {
//           console.error(`❌ Модель ${model} не знайдена для ${make} ${year}`);
//           return null;
//         }

//         // ❌ Клієнт відключився
//         // 🔍 Пошук за Make: BMW, Model: BMW Alpina B7 LWB XDrive, Year: 2020...
//         // ❌ Модель BMW Alpina B7 LWB XDrive не знайдена для BMW 2020

//         // Додатковий запит для отримання детальних характеристик
//         const vinExampleResponse = await axios.get(
//           `${NHTSA_API_URL}/GetVehicleVariableList?format=json`
//         );
//         carData = {
//           Make: carData.Make_Name,
//           Model: carData.Model_Name,
//           ModelYear: year,
//           FuelTypePrimary: "невідомо", // Потребує додаткового запиту з VIN
//           DisplacementCC: "0",
//           EngineHP: "невідомо",
//           EngineCylinders: "невідомо",
//           TransmissionStyle: "невідомо",
//           BodyClass: "невідомо",
//           Doors: "невідомо",
//           DriveType: "невідомо",
//           MakeID: carData.Make_ID,
//           ModelID: carData.Model_ID,
//           VehicleType: "Passenger Car", // За замовчуванням, уточнити за потреби
//           PlantCountry: "невідомо",
//           PlantCompanyName: "невідомо",
//         };
//       } else {
//         console.error(`❌ Дані для ${make} ${year} не знайдено`);
//         return null;
//       }
//     } else {
//       console.error("❌ Потрібен VIN або Make/Model/Year");
//       return null;
//     }

//     // Формуємо об'єкт характеристик відповідно до схеми
//     const specs = {
//       fuelType: mapFuelType(carData.FuelTypePrimary),
//       combustionEngine: {
//         engineDisplacement:
//           carData.DisplacementCC && carData.DisplacementCC !== "0"
//             ? parseFloat(carData.DisplacementCC) / 1000
//             : null,
//         horsepower: carData.EngineHP ? parseInt(carData.EngineHP) : null,
//         torque: null, // NHTSA не завжди надає torque
//         fuelConsumption: null, // Потребує іншого джерела
//         transmission: carData.TransmissionStyle || null,
//       },
//       nhtsaSpecs: {
//         make: carData.Make || "невідомо",
//         model: carData.Model || "невідомо",
//         makeId: carData.MakeID ? parseInt(carData.MakeID) : null,
//         modelId: carData.ModelID ? parseInt(carData.ModelID) : null,
//         year: carData.ModelYear ? parseInt(carData.ModelYear) : null,
//         vehicleType: carData.VehicleType || "невідомо",
//         plantCountry: carData.PlantCountry || "невідомо",
//         plantCompany: carData.PlantCompanyName || "невідомо",
//         bodyClass: carData.BodyClass || "невідомо",
//       },
//       additionalSpecs: {
//         doors: carData.Doors || "невідомо",
//         driveType: carData.DriveType || "невідомо",
//       },
//     };

//     console.log("✅ Характеристики отримано з NHTSA:", specs);
//     return specs;
//   } catch (error) {
//     console.error("❌ Помилка при запиті до NHTSA API:", error.message);
//     return null;
//   }
// };

// // Допоміжна функція для мапінгу типу палива
// function mapFuelType(fuelType) {
//   if (!fuelType) return null;
//   const fuelMap = {
//     Gasoline: "бензин",
//     Diesel: "дизель",
//     Electric: "електро",
//     Hybrid: "гібрид",
//   };
//   return (
//     fuelMap[fuelType] ||
//     fuelType.toLowerCase().replace(/\s+/g, "-").split("-")[0]
//   );
// }

// module.exports = { nhtsaSearchCarSpecs };

const axios = require("axios");

const NHTSA_API_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

const nhtsaSearchCarSpecs = async ({ vin, make, model, year }) => {
  try {
    let carData;

    if (vin) {
      console.log(`🔍 Пошук за VIN: ${vin} через NHTSA API...`);
      const response = await axios.get(
        `${NHTSA_API_URL}/DecodeVinValues/${vin}?format=json`
      );
      console.log("📋 Відповідь NHTSA за VIN:", response.data);

      if (response.data.Results && response.data.Results.length > 0) {
        carData = response.data.Results[0];
        if (carData.ErrorCode !== "0") {
          console.error(`❌ Помилка NHTSA API: ${carData.ErrorText}`);
          return null;
        }
      } else {
        console.error("❌ Дані за VIN не знайдено");
        return null;
      }
    } else if (make && model && year) {
      console.log(
        `🔍 Пошук за Make: ${make}, Model: ${model}, Year: ${year}...`
      );
      let response = await axios.get(
        `${NHTSA_API_URL}/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`
      );
      console.log("📋 Відповідь NHTSA за Make/Year:", response.data);

      if (response.data.Results && response.data.Results.length > 0) {
        carData = response.data.Results.find(
          (item) => item.Model_Name.toLowerCase() === model.toLowerCase()
        );
      }

      // Якщо модель не знайдена, шукаємо в попередньому році
      if (!carData && year) {
        const previousYear = parseInt(year) - 1;
        console.log(
          `🔍 Модель не знайдена, пошук за ${make} ${model} ${previousYear}...`
        );
        response = await axios.get(
          `${NHTSA_API_URL}/GetModelsForMakeYear/make/${make}/modelyear/${previousYear}?format=json`
        );
        console.log("📋 Відповідь NHTSA за Make/Previous Year:", response.data);

        if (response.data.Results && response.data.Results.length > 0) {
          carData = response.data.Results.find(
            (item) => item.Model_Name.toLowerCase() === model.toLowerCase()
          );
        }
      }

      if (!carData) {
        console.error(`❌ Модель ${model} не знайдена для ${make} ${year}`);
        return null;
      }

      carData = {
        Make: carData.Make_Name,
        Model: carData.Model_Name,
        ModelYear: carData.ModelYear || year,
        MakeID: carData.Make_ID,
        ModelID: carData.Model_ID,
        VehicleType: "Passenger Car",
        FuelTypePrimary: "Electric", // Для Tesla за замовчуванням
        DisplacementCC: "0", // Електромобілі не мають цього
        EngineHP: "невідомо",
        EngineCylinders: "0", // Електромобілі
        TransmissionStyle: "Automatic", // Припущення для Tesla
        BodyClass: "Sport Utility Vehicle (SUV)", // Припущення
        Doors: "4", // Припущення
        DriveType: "AWD", // Припущення для Tesla
        PlantCountry: "USA", // Припущення
        PlantCompanyName: "Tesla, Inc.",
      };
    } else {
      console.error("❌ Потрібен VIN або Make/Model/Year");
      return null;
    }

    const specs = {
      fuelType: mapFuelType(carData.FuelTypePrimary),
      combustionEngine: {
        engineDisplacement:
          carData.DisplacementCC && carData.DisplacementCC !== "0"
            ? parseFloat(carData.DisplacementCC) / 1000
            : null,
        horsepower: carData.EngineHP ? parseInt(carData.EngineHP) : null,
        torque: null,
        fuelConsumption: null,
        transmission: carData.TransmissionStyle || null,
      },
      nhtsaSpecs: {
        make: carData.Make || "невідомо",
        model: carData.Model || "невідомо",
        makeId: carData.MakeID ? parseInt(carData.MakeID) : null,
        modelId: carData.ModelID ? parseInt(carData.ModelID) : null,
        year: carData.ModelYear ? parseInt(carData.ModelYear) : null,
        vehicleType: carData.VehicleType || "невідомо",
        plantCountry: carData.PlantCountry || "невідомо",
        plantCompany: carData.PlantCompanyName || "невідомо",
        bodyClass: carData.BodyClass || "невідомо",
      },
      additionalSpecs: {
        doors: carData.Doors || "невідомо",
        driveType: carData.DriveType || "невідомо",
      },
    };

    console.log("✅ Характеристики отримано з NHTSA:", specs);
    return specs;
  } catch (error) {
    console.error("❌ Помилка при запиті до NHTSA API:", error.message);
    return null;
  }
};

function mapFuelType(fuelType) {
  if (!fuelType) return null;
  const fuelMap = {
    Gasoline: "бензин",
    Diesel: "дизель",
    Electric: "електро",
    Hybrid: "гібрид",
  };
  return (
    fuelMap[fuelType] ||
    fuelType.toLowerCase().replace(/\s+/g, "-").split("-")[0]
  );
}

module.exports = { nhtsaSearchCarSpecs };

// const axios = require("axios");
// const { CarSpecs } = require("../models/CarSpecsSchema"); // Ваші моделі MongoDB
// require("dotenv").config();

// const NHTSA_API_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

// // Функція для отримання характеристик автомобіля за маркою, моделлю та роком
// async function nhtsaSearchCarSpecs(make, model, year) {
//   try {
//     // Запит для отримання моделей для конкретної марки
//     const modelsResponse = await axios.get(
//       `${NHTSA_API_URL}/getmodelsformake/${make}`,
//       {
//         params: {
//           format: "json",
//         },
//       }
//     );

//     if (
//       modelsResponse.data.Results &&
//       modelsResponse.data.Results.length === 0
//     ) {
//       console.error("Моделі для цієї марки не знайдені.");
//       return null;
//     }

//     const models = modelsResponse.data.Results;
//     console.log("Available Models: ", models);

//     // Знайти модель за назвою
//     const carModel = models.find(
//       (item) => item.Model_Name.toLowerCase() === model.toLowerCase()
//     );

//     if (!carModel) {
//       console.error("Модель не знайдена.");
//       return null;
//     }

//     // Якщо модель знайдена, зберігаємо її в MongoDB
//     const carSpecs = {
//       make: carModel.Make_Name,
//       model: carModel.Model_Name,
//       modelId: carModel.Model_ID,
//       makeId: carModel.Make_ID,
//       year: year,
//     };

//     // Збереження характеристик у MongoDB
//     const newCarSpecs = new CarSpecs({
//       carId: `${make}_${model}_${year}`, // Можна використати унікальний ідентифікатор
//       source: "nhtsa",
//       carSpecs, // Технічні характеристики
//     });

//     await newCarSpecs.save();

//     console.log("Характеристики збережено в MongoDB");
//     return carSpecs;
//   } catch (error) {
//     console.error("❌ Помилка отримання характеристик з NHTSA API:", error);
//     return null;
//   }
// }

// module.exports = { nhtsaSearchCarSpecs };

// const axios = require("axios");

// const NHTSA_API_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

// // Функція для отримання технічних характеристик авто
// async function nhtsaSearchCarSpecs(make, model, year) {
//   try {
//     const response = await axios.get(`${NHTSA_API_URL}/getallmakes`, {
//       params: {
//         make,
//         model,
//         year,
//         format: "json",
//       },
//     });

//     // Перевіряємо, чи є дані в відповіді
//     if (response.data.Results && response.data.Results.length > 0) {
//       console.log("NHTSA RESULTS : ", response.data.Results);
//       return response.data.Results[0]; // Повертаємо перший результат
//     }

//     return null; // Якщо дані не знайдені
//   } catch (error) {
//     console.error("❌ Помилка отримання даних з NHTSA API:", error);
//     return null;
//   }
// }

// module.exports = { nhtsaSearchCarSpecs };
