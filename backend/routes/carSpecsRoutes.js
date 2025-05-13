const express = require("express");
const {
  addCarSpecs,
  getCarSpecs,
  updateCarSpecs,
  deleteCarSpecs,
  msnSearchCarSpecs,
  getCarSpecsFromGCS,
  scrapeCarSpecs,
  getAutoRiaSpecs,
  aiSearchCarSpecs,
  bingSearchCarSpecs,
} = require("../controllers/carSpecsController");

const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, addCarSpecs); // Додавання характеристик в базу
router.post("/google-search", auth, getCarSpecsFromGCS);
router.post("/msn-search", auth, msnSearchCarSpecs);
router.post("/bing-search", auth, bingSearchCarSpecs);
router.post("/ai-search", auth, aiSearchCarSpecs);

router.get("/auto-ria", auth, getAutoRiaSpecs);
router.get("/scrape", auth, scrapeCarSpecs); // Автоматичний парсинг з Wikipedia
// router.get("/specs/:carId", getCarSpecsByCarId);
router.get("/:carId", getCarSpecs); // Отримання з бази

router.put("/:carId", auth, updateCarSpecs); // Оновлення специфікацій за _id
router.delete("/:carId", auth, deleteCarSpecs); // Видалення специфікацій за _id

module.exports = router;
