const express = require("express");
const {
  addCarSpecs,
  getCarSpecs,
  msnSearchCarSpecs,
  getCarSpecsFromGCS,
  scrapeCarSpecs,
  getAutoRiaSpecs,
  aiSearchCarSpecs,
  bingSearchCarSpecs,
} = require("../controllers/carSpecsController");

const router = express.Router();

router.post("/", addCarSpecs); // Додавання характеристик в базу
router.post("/google-search", getCarSpecsFromGCS);
router.post("/msn-search", msnSearchCarSpecs);
router.post("/bing-search", bingSearchCarSpecs);
router.post("/ai-search", aiSearchCarSpecs);

router.get("/auto-ria", getAutoRiaSpecs);
router.get("/scrape", scrapeCarSpecs); // Автоматичний парсинг з Wikipedia
// router.get("/specs/:carId", getCarSpecsByCarId);
router.get("/:carId", getCarSpecs); // Отримання з бази

module.exports = router;
