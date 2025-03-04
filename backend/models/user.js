const mongoose = require("mongoose");

require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },
    password: { type: String, required: true, minlength: 6, maxlength: 1024 },
    isAdmin: { type: Boolean, default: false },
    avatar: { type: String, default: "" }, // URL аватара
    avatarHash: { type: String, default: "" }, // хеш аватара
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// exports.User = User; якщо так то import {User}
module.exports = User;
