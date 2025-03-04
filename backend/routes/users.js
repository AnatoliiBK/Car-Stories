const User = require("../models/user");
const {
  auth,
  isUser,
  isAdmin,
  isAuthenticated,
} = require("../middleware/auth");
const moment = require("moment");
const cloudinary = require("../utils/cloudinary");
const crypto = require("crypto"); // Модуль для хешування
const axios = require("axios"); // Модуль для завантаження зображень

const router = require("express").Router();

// Функція для перевірки зображень у Cloudinary за хешем
const checkIfImageExistsInCloudinary = async (hash) => {
  try {
    // Отримуємо всі зображення з Cloudinary
    const resources = await cloudinary.api.resources({
      type: "upload",
      prefix: "Avatars Car Stories/",
      max_results: 500,
      context: true, // Додаємо метадані до відповіді
    });

    console.log("RESOURCES: ", resources);

    // Перевіряємо кожне зображення, отримане з Cloudinary
    for (const resource of resources.resources) {
      const resourceHash = resource.context?.custom?.hash;
      console.log("RESOURCE HASH: ", resourceHash);

      // Порівнюємо хеші
      if (resourceHash === hash) {
        return resource; // Повертаємо ресурс, якщо хеші співпадають
      }
    }

    // Якщо не знайшли співпадіння
    return null;
  } catch (error) {
    console.error("Error fetching Cloudinary images:", error);
    throw new Error("Cloudinary error");
  }
};

// Завантаження нового аватара
router.post("/upload-avatar", auth, async (req, res) => {
  const { image, hash } = req.body;
  console.log("REQUEST BODY HASH : ", hash);

  if (!image || !hash) {
    return res.status(400).json({ msg: "No file or hash provided" });
  }

  try {
    // Перевіряємо, чи існує зображення з таким самим хешем у Cloudinary
    const existingImage = await checkIfImageExistsInCloudinary(hash);
    console.log("CHECK IF EXISTING IMAGE WITH HASH : ", existingImage);

    if (existingImage) {
      // Якщо зображення вже існує, оновлюємо профіль користувача з використанням наявного URL
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: existingImage.secure_url, avatarHash: hash },
        { new: true }
      );

      return res.json({
        msg: "Avatar updated with existing image from Cloudinary",
        avatar: existingImage.secure_url,
      });
    }

    // Завантажуємо нове зображення в Cloudinary, якщо хеш не знайдено
    const result = await cloudinary.uploader.upload(image, {
      upload_preset: "avatars CS",
      context: `hash=${hash}`, // Додаємо хеш як метадані
    });

    console.log("Cloudinary upload result:", result); // Логування результату завантаження

    // Оновлюємо аватар та хеш у базі даних користувача
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url, avatarHash: hash },
      { new: true }
    );

    return res.json({
      msg: "Avatar uploaded successfully",
      avatar: result.secure_url,
    });
  } catch (err) {
    console.error("Error uploading avatar:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET ALL USERS middleware, яка перевіряє лише факт автентифікації
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE USER
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(deleteUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET USER
router.get("/find/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Маршрут для отримання даних про поточного користувача
router.get("/me", auth, async (req, res) => {
  try {
    // Знаходимо користувача за ID, яке витягнули з токена
    const user = await User.findById(req.user._id).select("-password"); // Виключаємо пароль із результату
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Помилка отримання даних користувача:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
});

// UPDATE USER
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // if (user.email !== req.body.email) {}

    if (!(user.email === req.body.email)) {
      const emailInUse = await User.findOne({ email: req.body.email });

      if (emailInUse) return res.status(400).json("That Email Is Taken");
    }

    if (req.body.password && user) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
        password: user.password,
      },
      { new: true }
    );
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE USER NAME (SELF)
router.patch("/:id/update-name", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      userId: updatedUser._id,
      name: updatedUser.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user name" });
  }
});

// GET USER STATS
router.get("/stats", isAdmin, async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");
  // res.json(previousMonth);
  try {
    const users = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(previousMonth) },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    console.log("STATS USERS ; ", users);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
