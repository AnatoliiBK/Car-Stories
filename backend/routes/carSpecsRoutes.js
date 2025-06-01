const express = require("express");
const {
  addCarSpecs,
  getCarSpecs,
  getPermissionRequests,
  getMyPermissionResponses,
  respondToPermissionRequest,
  getPermissionRequestsList,
  getPermissionRequestStatus,
  updateCarSpecs,
  deleteCarSpecs,
  msnSearchCarSpecs,
  getCarSpecsFromGCS,
  scrapeCarSpecs,
  getAutoRiaSpecs,
  aiSearchCarSpecs,
  bingSearchCarSpecs,
  createPermissionRequest,
  clearPermissionResponses,
  deleteSinglePermissionResponse,
} = require("../controllers/carSpecsController");

const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, addCarSpecs); // Додавання характеристик в базу
router.post("/google-search", auth, getCarSpecsFromGCS);
router.post("/msn-search", auth, msnSearchCarSpecs);
router.post("/bing-search", auth, bingSearchCarSpecs);
router.post("/ai-search", auth, aiSearchCarSpecs);
router.post("/permission-request", auth, createPermissionRequest); // для функціювання і додавання лічильника запитів власнику

router.get("/permission-responses", auth, getMyPermissionResponses);

router.get("/permission-requests", auth, getPermissionRequestsList); // 🔐список запитів власнику опрацьованих
router.get("/status", auth, getPermissionRequestStatus); // 🔐список запитів власнику опрацьованих
router.get("/my-pending", auth, getPermissionRequests); // список запитів власнику не опрацьованих
router.get("/auto-ria", auth, getAutoRiaSpecs);
router.get("/scrape", auth, scrapeCarSpecs); // Автоматичний парсинг з Wikipedia
router.get("/:carId", getCarSpecs); // Отримання з бази
router.patch("/permission-request/:id", auth, respondToPermissionRequest); // підтвердження/відхилення

// ✅ Спеціальні маршрути спочатку
router.delete("/clear-responses", auth, clearPermissionResponses);
router.delete("/response/:id", auth, deleteSinglePermissionResponse);
// ❗️ Загальні — в кінці
router.delete("/:carId", auth, deleteCarSpecs);
router.put("/:carId", auth, updateCarSpecs); // Оновлення специфікацій за _id

module.exports = router;
