const Cart = require("../models/cart");
const User = require("../models/user"); // Імпортуємо модель User

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        let productItem = cart.items[itemIndex]; //продукт з індексом itemIndex
        //  з масиву продуктів items в кошику cart що в MongoDB. цей продукт має поля
        // product і quantity.
        productItem.quantity += quantity;
        cart.items[itemIndex] = productItem; //пояснення:
        // якщо в елементі масиву cart.items[itemIndex] змінюється його
        // властивість quantity, відбувається робота з копією цього елемента.Якщо не
        // призначити змінений елемент назад у масив за допомогою
        // cart.items[itemIndex] = productItem, зміни, внесені у productItem,
        // не відобразяться в масиві cart.items.
        // цей рядок є обов'язковим, якщо потрібно оновити масив з новим значенням.
      } else {
        cart.items.push({ product: productId, quantity });
      }

      cart = await cart.save();
      res.status(200).json(cart);
    } else {
      // Якщо кошика немає, знаходимо ім'я користувача
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const newCart = await Cart.create({
        user: userId,
        userName: user.name, // Додаємо userName при створенні нового кошика
        items: [{ product: productId, quantity }],
      });
      res.status(201).json(newCart);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const decreaseCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        const item = cart.items[itemIndex];
        if (item.quantity > 1) {
          item.quantity -= quantity;
          cart.items[itemIndex] = item;
        } else {
          cart.items.splice(itemIndex, 1);
        }

        await cart.save();
        res.status(200).json(cart);
      } else {
        res.status(404).json({ message: "Product not found in cart" });
      }
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );

      cart = await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOneAndDelete({ user: userId });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    // if (cart) {
    //   res.status(200).json(cart);
    // } else {
    //   res.status(404).json({ message: "Cart not found" });
    // }

    // Якщо кошика немає, повертаємо порожній об'єкт
    if (!cart) {
      return res.status(200).json({ user: userId, items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTotals = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    // if (cart) {
    //   const { total, quantity } = cart.items.reduce(
    //     (cartTotal, cartItem) => {
    //       const { price } = cartItem.product;
    //       const { quantity } = cartItem;
    //       const itemTotal = price * quantity;

    //       cartTotal.total += itemTotal;
    //       cartTotal.quantity += quantity;

    //       return cartTotal;
    //     },
    //     {
    //       total: 0,
    //       quantity: 0,
    //     }
    //   );
    //   res.status(200).json({ total, quantity });
    // } else {
    //   res.status(404).json({ message: "Cart not found" });
    // }
    // Якщо кошика немає, повертаємо total та quantity зі значенням 0
    if (!cart) {
      return res.status(200).json({ total: 0, quantity: 0 });
    }

    const { total, quantity } = cart.items.reduce(
      (cartTotal, cartItem) => {
        const { price } = cartItem.product;
        const { quantity } = cartItem;
        const itemTotal = price * quantity;

        cartTotal.total += itemTotal;
        cartTotal.quantity += quantity;

        return cartTotal;
      },
      {
        total: 0,
        quantity: 0,
      }
    );

    res.status(200).json({ total, quantity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToCart,
  decreaseCart,
  removeFromCart,
  clearCart,
  getCart,
  getTotals,
};

// const Cart = require("../models/cart");
// const Product = require("../models/product");

// const getCart = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const cart = await Cart.findOne({ user: userId }).populate("items.product");

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const addToCart = async (req, res) => {
//   const { userId, productId, quantity } = req.body;

//   try {
//     let cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       cart = new Cart({ user: userId, items: [] });
//     }

//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const itemIndex = cart.items.findIndex(
//       (item) => item.product.toString() === productId
//     );

//     if (itemIndex > -1) {
//       cart.items[itemIndex].quantity += quantity;
//     } else {
//       cart.items.push({ product: productId, quantity });
//     }

//     await cart.save();
//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const removeFromCart = async (req, res) => {
//   const { userId, productId, quantity } = req.body;

//   try {
//     let cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     const itemIndex = cart.items.findIndex(
//       (item) => item.product.toString() === productId
//     );

//     if (itemIndex === -1) {
//       return res.status(404).json({ message: "Product not found in cart" });
//     }

//     if (quantity >= cart.items[itemIndex].quantity) {
//       cart.items.splice(itemIndex, 1);
//     } else {
//       cart.items[itemIndex].quantity -= quantity;
//     }

//     await cart.save();
//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const clearCart = async (req, res) => {
//   const { userId } = req.body;

//   try {
//     let cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     cart.items = [];
//     await cart.save();
//     res.status(200).json({ message: "Cart cleared" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { addToCart, removeFromCart, getCart, clearCart };
