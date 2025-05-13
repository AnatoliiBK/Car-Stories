const mongoose = require("mongoose");

const CarSpecsSchema = new mongoose.Schema(
  {
    // carId: {
    //   type: String, // Використовуємо рядок, щоб уникнути обмежень ObjectId
    //   required: true,
    //   unique: true, // Унікальність carId для кожної машини
    // },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
      unique: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vin: {
      type: String,
      trim: true,
      uppercase: true,
      minlength: 17,
      maxlength: 17,
      // unique: true,
    },

    // Джерело даних (додали nhtsa)
    source: {
      type: String,
      enum: [
        "manual",
        "auto-ria",
        "AI",
        "bing",
        "msn",
        "gcs",
        "algolia",
        "nhtsa",
      ],
      required: true,
    },

    // Тип палива
    fuelType: {
      type: String,
      enum: ["бензин", "дизель", "гібрид", "електро"],
    },

    // Двигун внутрішнього згоряння
    combustionEngine: {
      engineDisplacement: Number,
      horsepower: Number,
      torque: Number,
      fuelConsumption: Number,
      transmission: String,
    },

    // Гібридний двигун
    hybrid: {
      hybridType: String,
      engineDisplacement: Number,
      electricMotorPower: Number,
      totalHorsepower: Number,
      electricRange: Number,
    },

    // Електричний двигун
    electric: {
      batteryCapacity: Number,
      range: Number,
      electricMotorPower: Number,
      chargeTime: String,
      chargePort: String,
    },

    // ✅ Новий блок для збереження даних з NHTSA
    nhtsaSpecs: {
      make: String,
      model: String,
      makeId: Number,
      modelId: Number,
      year: Number,
      vehicleType: String, // Тип авто (легкове, вантажне тощо)
      plantCountry: String, // Країна виробництва
      plantCompany: String, // Завод-виробник
      bodyClass: String, // Тип кузова
    },

    // Додаткові характеристики (інформація, отримана через Bing, GCS тощо)
    additionalSpecs: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Корисні посилання
    usefulLinks: [
      {
        title: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarSpecs", CarSpecsSchema);

// const mongoose = require("mongoose");

// const CarSpecsSchema = new mongoose.Schema(
//   {
//     carId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Car",
//       required: true,
//       unique: true,
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     brand: {
//       type: String,
//       trim: true,
//     },
//     model: {
//       type: String,
//       trim: true,
//     },

//     year: {
//       type: Number,
//     },

//     vin: {
//       type: String,
//       trim: true,
//       uppercase: true,
//       minlength: 17,
//       maxlength: 17,
//       unique: true,
//     },

//     source: {
//       type: String,
//       enum: [
//         "manual",
//         "auto-ria",
//         "AI",
//         "bing",
//         "msn",
//         "gcs",
//         "algolia",
//         "nhtsa",
//       ],
//       required: true,
//     },

//     fuelType: {
//       type: String,
//       enum: ["бензин", "дизель", "гібрид", "електро"],
//     },

//     combustionEngine: {
//       engineDisplacement: Number,
//       horsepower: Number,
//       torque: Number,
//       fuelConsumption: Number,
//       transmission: String,
//     },

//     hybrid: {
//       hybridType: String,
//       engineDisplacement: Number,
//       electricMotorPower: Number,
//       totalHorsepower: Number,
//       electricRange: Number,
//     },

//     electric: {
//       batteryCapacity: Number,
//       range: Number,
//       electricMotorPower: Number,
//       chargeTime: String,
//       chargePort: String,
//     },

//     nhtsaSpecs: {
//       make: String,
//       model: String,
//       makeId: Number,
//       modelId: Number,
//       year: Number,
//       vehicleType: String,
//       plantCountry: String,
//       plantCompany: String,
//       bodyClass: String,
//     },

//     additionalSpecs: {
//       type: Map,
//       of: mongoose.Schema.Types.Mixed,
//       default: {},
//     },

//     usefulLinks: [
//       {
//         title: {
//           type: String,
//           trim: true,
//         },
//         url: {
//           type: String,
//           trim: true,
//         },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // Автоматичне підтягування createdBy (тільки ім'я і email)
// CarSpecsSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "createdBy",
//     select: "name email",
//   });
//   next();
// });

// module.exports = mongoose.model("CarSpecs", CarSpecsSchema);

// 🔵 🔥

// const mongoose = require("mongoose");

// const CarSpecsSchema = new mongoose.Schema(
//   {
//     carId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Car",
//       required: true,
//     },

//     // Джерело даних (manual - вручну, auto-ria - автоматично, AI - OpenAI, bing - пошук Bing, gcs - Google Cloud Search)
//     source: {
//       type: String,
//       enum: ["manual", "auto-ria", "AI", "bing", "gcs", "algolia"],
//       required: true,
//     },

//     // Тип палива
//     fuelType: {
//       type: String,
//       enum: ["бензин", "дизель", "гібрид", "електро"],
//     },

//     // Двигун внутрішнього згоряння
//     combustionEngine: {
//       engineDisplacement: Number,
//       horsepower: Number,
//       torque: Number,
//       fuelConsumption: Number,
//       transmission: String,
//     },

//     // Гібридний двигун
//     hybrid: {
//       hybridType: String,
//       engineDisplacement: Number,
//       electricMotorPower: Number,
//       totalHorsepower: Number,
//       electricRange: Number,
//     },

//     // Електричний двигун
//     electric: {
//       batteryCapacity: Number,
//       range: Number,
//       electricMotorPower: Number,
//       chargeTime: String,
//       chargePort: String,
//     },

//     // Додаткові характеристики (інформація, отримана через Bing, Google Cloud Search, або інші джерела)
//     additionalSpecs: {
//       type: Map,
//       of: mongoose.Schema.Types.Mixed,
//       default: {},
//     },

//     // Посилання з Bing, Google Cloud Search
//     usefulLinks: [
//       {
//         title: String,
//         url: String,
//       },
//     ],

//     // Дата створення запису
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("CarSpecs", CarSpecsSchema);

// const mongoose = require("mongoose");

// const CarSpecsSchema = new mongoose.Schema(
//   {
//     carId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Car",
//       required: true,
//     },

//     // Джерело даних (manual - вручну, auto-ria - автоматично)
//     source: {
//       type: String,
//       enum: ["manual", "auto-ria", "AI"],
//       required: true,
//     },

//     // Тип палива
//     fuelType: {
//       type: String,
//       enum: ["бензин", "дизель", "гібрид", "електро"],
//       required: true,
//     },

//     // Двигун внутрішнього згоряння (для бензинових і дизельних авто)
//     combustionEngine: {
//       engineDisplacement: {
//         type: Number,
//         required: function () {
//           return this.fuelType === "бензин" || this.fuelType === "дизель";
//         },
//       },
//       horsepower: {
//         type: Number,
//         required: function () {
//           return this.fuelType === "бензин" || this.fuelType === "дизель";
//         },
//       },
//       torque: Number,
//       fuelConsumption: Number,
//       transmission: String,
//     },

//     // Гібридний двигун (для гібридних авто)
//     hybrid: {
//       hybridType: {
//         type: String,
//         required: function () {
//           return this.fuelType === "гібрид";
//         },
//       },
//       engineDisplacement: {
//         type: Number,
//         required: function () {
//           return this.fuelType === "гібрид";
//         },
//       },
//       electricMotorPower: Number,
//       totalHorsepower: Number,
//       electricRange: Number,
//     },

//     // Електричний двигун (для електромобілів)
//     electric: {
//       batteryCapacity: {
//         type: Number,
//         required: function () {
//           return this.fuelType === "електро";
//         },
//       },
//       range: Number,
//       electricMotorPower: Number,
//       chargeTime: String,
//       chargePort: String,
//     },

//     // Додаткові характеристики (наприклад, параметри, яких немає в схемі)
//     additionalSpecs: {
//       type: Map,
//       of: mongoose.Schema.Types.Mixed,
//       default: {},
//     },

//     // Дата створення запису
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("CarSpecs", CarSpecsSchema);

// const mongoose = require("mongoose");

// const CarSpecsSchema = new mongoose.Schema({
//   carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
//   fuelType: {
//     type: String,
//     enum: ["бензин", "дизель", "гібрид", "електро"],
//     required: true,
//   },

//   combustionEngine: {
//     engineDisplacement: Number,
//     horsepower: Number,
//     torque: Number,
//     fuelConsumption: Number,
//     transmission: String,
//   },

//   hybrid: {
//     hybridType: String,
//     engineDisplacement: Number,
//     electricMotorPower: Number,
//     totalHorsepower: Number,
//     electricRange: Number,
//   },

//   electric: {
//     batteryCapacity: Number,
//     range: Number,
//     electricMotorPower: Number,
//     chargeTime: String,
//     chargePort: String,
//   },

//   source: {
//     type: String,
//     enum: ["manual", "auto-ria", "wikipedia"],
//     required: true,
//   },

//   additionalSpecs: {
//     type: Map,
//     of: mongoose.Schema.Types.Mixed,
//     default: {},
//   },
// });

// module.exports = mongoose.model("CarSpecs", CarSpecsSchema);
