// замість цьго коду використовується код в файлі cartRoutes

// const express = require("express");
// const router = express.Router();
// const Cart = require("../models/cart");
// const { auth } = require("../middleware/auth");

// // Додавання товару до корзини
// router.post("/add", auth, async (req, res) => {
//   // const { userId, productId, quantity } = req.body;
//   const { productId, quantity } = req.body; //дані, надіслані з клієнта на сервер
//   // через HTTP - запит.
//   const userId = req.user._id;
//   console.log("Received request to add to cart:", {
//     productId,
//     quantity,
//   });
//   try {
//     let cart = await Cart.findOne({ userId, productId, quantity });

//     if (cart) {
//       // Якщо товар вже є у корзині, збільшуємо його кількість
//       const itemIndex = cart.cartItems.findIndex(
//         (item) => item.productId === productId
//       );

//       if (itemIndex > -1) {
//         cart.cartItems[itemIndex].quantity += quantity;
//       } else {
//         // Якщо товару немає у корзині, додаємо його
//         cart.cartItems.push({ productId, quantity });
//       }
//     } else {
//       // Якщо корзини немає, створюємо нову
//       cart = new Cart({
//         userId,
//         cartItems: [{ productId, quantity }],
//       });
//     }

//     await cart.save();
//     res.status(200).send(cart);
//   } catch (error) {
//     res.status(500).send("Something went wrong");
//   }
// });

// // Отримання корзини користувача
// router.get("/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const cart = await Cart.findOne({ userId }).populate("cartItems.productId");

//     // if (!cart) {
//     //   // Якщо кошик не існує, повертаємо порожній об'єкт із нульовими значеннями
//     //   return res.status(200).json({
//     //     cartItems: [],
//     //     totalQuantity: 0,
//     //     totalAmount: 0,
//     //   });
//     // }
//     res.status(200).send(cart);
//   } catch (error) {
//     res.status(500).send("Something went wrong");
//   }
// });

// // Зменшення кількості товару
// router.post("/decrease", async (req, res) => {
//   try {
//     const { userId, productId, quantity } = req.body;
//     const cart = await Cart.findOne({ user: userId });

//     if (cart) {
//       const itemIndex = cart.items.findIndex(
//         (item) => item.product.toString() === productId
//       );

//       if (itemIndex > -1) {
//         const item = cart.items[itemIndex];
//         if (item.quantity > 1) {
//           item.quantity -= quantity;
//           cart.items[itemIndex] = item;
//         } else {
//           cart.items.splice(itemIndex, 1);
//         }

//         await cart.save();
//         res.status(200).json(cart);
//       } else {
//         res.status(404).json({ message: "Product not found in cart" });
//       }
//     } else {
//       res.status(404).json({ message: "Cart not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Очищення корзини користувача
// router.post("/clear", async (req, res) => {
//   const { userId } = req.body;

//   try {
//     const cart = await Cart.findOne({ userId });

//     if (cart) {
//       cart.items = [];
//       await cart.save();
//       res.status(200).send(cart);
//     } else {
//       res.status(404).send("Cart not found");
//     }
//   } catch (error) {
//     res.status(500).send("Something went wrong");
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Cart = require("../models/cart");

// // Додавання товару до корзини
// router.post("/add", async (req, res) => {
//   const { userId, productId, quantity } = req.body;

//   try {
//     let cart = await Cart.findOne({ userId });

//     if (cart) {
//       // Якщо товар вже є у корзині, збільшуємо його кількість
//       const itemIndex = cart.items.findIndex(
//         (item) => item.productId == productId
//       );

//       if (itemIndex > -1) {
//         cart.items[itemIndex].quantity += quantity;
//       } else {
//         // Якщо товару немає у корзині, додаємо його
//         cart.items.push({ productId, quantity });
//       }
//     } else {
//       // Якщо корзини немає, створюємо нову
//       cart = new Cart({
//         userId,
//         items: [{ productId, quantity }],
//       });
//     }

//     await cart.save();
//     res.status(200).send(cart);
//   } catch (error) {
//     res.status(500).send("Something went wrong");
//   }
// });

// // Отримання корзини користувача
// router.get("/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const cart = await Cart.findOne({ userId }).populate("items.productId");
//     res.status(200).send(cart);
//   } catch (error) {
//     res.status(500).send("Something went wrong");
//   }
// });

// module.exports = router;
