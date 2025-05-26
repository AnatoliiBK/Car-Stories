const mongoose = require("mongoose");

const permissionRequestSchema = new mongoose.Schema(
  {
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // approved: { type: Boolean, default: false },
    approved: { type: Boolean, default: null },

    // ⏳ Коли запит відхилено
    rejectedAt: {
      type: Date,
      default: null,
      index: {
        // expireAfterSeconds: 60 * 60 * 24 * 7, // 7 днів
        // expireAfterSeconds: 60 * 60 * 1, // 12 годин
        expireAfterSeconds: 20 * 60, // 20 хвилин
      },
    },

    // ⏳ Коли запит схвалено
    approvedAt: {
      type: Date,
      default: null,
      index: {
        // expireAfterSeconds: 60 * 60 * 1, // 24 години
        expireAfterSeconds: 20 * 60, // 20 хвилин
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PermissionRequest", permissionRequestSchema);

// const mongoose = require("mongoose");

// const permissionRequestSchema = new mongoose.Schema(
//   {
//     carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
//     requesterId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     approved: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("PermissionRequest", permissionRequestSchema);
