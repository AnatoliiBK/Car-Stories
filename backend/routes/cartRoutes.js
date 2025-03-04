const express = require("express");
const router = express.Router();
const {
  addToCart,
  decreaseCart,
  removeFromCart,
  clearCart,
  getCart,
  getTotals,
} = require("../controllers/cartControler");

router.post("/add", addToCart);
router.post("/decrease", decreaseCart);
router.post("/remove", removeFromCart);
router.post("/clear", clearCart);
router.get("/:userId", getCart);
router.get("/totals/:userId", getTotals);

module.exports = router;

// const express = require("express");
// const {
//   addToCart,
//   removeFromCart,
//   getCart,
//   clearCart,
// } = require("../controllers/cartControler");
// const router = express.Router();

// router.post("/add", addToCart);
// router.post("/remove", removeFromCart);
// router.get("/:userId", getCart);
// router.post("/clear", clearCart);

// module.exports = router;
