import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";
import { setHeaders, url } from "./api";

const initialState = {
  cartItems: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  status: "idle",
  error: null,
};

// Асинхронні дії для роботи з бекендом
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId) => {
  const response = await axios.get(`${url}/cart/${userId}`, setHeaders());
  return response.data;
});

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity = 1 }) => {
    const response = await axios.post(
      `${url}/cart/add`,
      { userId, productId, quantity },
      setHeaders()
    );

    return response.data;
  }
);

export const decreaseCart = createAsyncThunk(
  "cart/decreaseCart",
  async ({ userId, productId }) => {
    const response = await axios.post(
      `${url}/cart/decrease`,
      { userId, productId },
      setHeaders()
    );
    return response.data;
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, productId }) => {
    const response = await axios.post(
      `${url}/cart/remove`,
      { userId, productId },
      setHeaders()
    );
    return response.data;
  }
);

export const clearCart = createAsyncThunk("cart/clearCart", async (userId) => {
  const response = await axios.post(
    `${url}/cart/clear`,
    { userId },
    setHeaders()
  );
  return response.data;
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // getTotals: (state, action) => {... або
    getTotals(state, action) {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, cartQuantity } = cartItem;
          const itemTotal = price * cartQuantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += cartQuantity;

          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );
      total = parseFloat(total.toFixed(2));
      state.cartTotalQuantity = quantity;
      state.cartTotalAmount = total;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = action.payload.cartItems;
        state.cartTotalQuantity = action.payload.cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.cartTotalAmount = action.payload.cartItems.reduce(
          (total, item) => total + item.productId.price * item.quantity,
          0
        );
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
        state.cartTotalQuantity = action.payload.cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.cartTotalAmount = action.payload.cartItems.reduce(
          (total, item) => total + item.productId.price * item.quantity,
          0
        );

        const existingIndex = state.cartItems.findIndex(
          (item) => item.productId._id === action.meta.arg.productId
        );
        if (existingIndex >= 0) {
          toast.info("Increased product quantity", { position: "bottom-left" });
        } else {
          toast.success("Product added to cart", { position: "bottom-left" });
        }
      })
      .addCase(decreaseCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
        state.cartTotalQuantity = action.payload.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.cartTotalAmount = action.payload.items.reduce(
          (total, item) => total + item.productId.price * item.quantity,
          0
        );

        const existingIndex = state.cartItems.findIndex(
          (item) => item.productId._id === action.meta.arg.productId
        );
        if (existingIndex >= 0 && action.payload.quantity === 0) {
          toast.error("Product removed from cart", { position: "bottom-left" });
        } else {
          toast.info("Decreased product quantity", { position: "bottom-left" });
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
        state.cartTotalQuantity = action.payload.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.cartTotalAmount = action.payload.items.reduce(
          (total, item) => total + item.productId.price * item.quantity,
          0
        );

        toast.error("Product removed from cart", { position: "bottom-left" });
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cartItems = [];
        state.cartTotalQuantity = 0;
        state.cartTotalAmount = 0;
        toast.error("Cart cleared", { position: "bottom-left" });
      });
  },
});

export const { getTotals } = cartSlice.actions;

export default cartSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { setHeaders, url } from "./api";
// import { toast } from "react-toastify";

// const initialState = {
//   cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
//   cartTotalQuantity: 0,
//   cartTotalAmount: 0,
//   userId: null,
// };

// export const fetchCart = createAsyncThunk(
//   "cart/fetchCart",
//   async (userId, thunkAPI) => {
//     const response = await axios.get(`${url}/cart/${userId}`);
//     return response.data;
//   }
// );

// export const syncCart = createAsyncThunk(
//   "cart/syncCart",
//   async ({ userId, cartItems }, thunkAPI) => {
//     const response = await axios.post(`${url}/cart/${userId}/sync`, {
//       cartItems,
//     });
//     return response.data;
//   }
// );

// export const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart(state, action) {
//       const existingIndex = state.cartItems.findIndex(
//         (item) => item._id === action.payload._id
//       );
//       if (existingIndex >= 0) {
//         state.cartItems[existingIndex] = {
//           ...state.cartItems[existingIndex],
//           cartQuantity: state.cartItems[existingIndex].cartQuantity + 1,
//         };
//         toast.info("Increased product quantity", {
//           position: "bottom-left",
//         });
//       } else {
//         let tempProductItem = { ...action.payload, cartQuantity: 1 };
//         state.cartItems.push(tempProductItem);
//         toast.success("Product added to cart", {
//           position: "bottom-left",
//         });
//       }
//       localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//     },
//     decreaseCart(state, action) {
//       const itemIndex = state.cartItems.findIndex(
//         (item) => item._id === action.payload._id
//       );

//       if (state.cartItems[itemIndex].cartQuantity > 1) {
//         state.cartItems[itemIndex].cartQuantity -= 1;

//         toast.info("Decreased product quantity", {
//           position: "bottom-left",
//         });
//       } else if (state.cartItems[itemIndex].cartQuantity === 1) {
//         const nextCartItems = state.cartItems.filter(
//           (item) => item._id !== action.payload._id
//         );

//         state.cartItems = nextCartItems;

//         toast.error("Product removed from cart", {
//           position: "bottom-left",
//         });
//       }

//       localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//     },
//     removeFromCart(state, action) {
//       const nextCartItems = state.cartItems.filter(
//         (item) => item._id !== action.payload._id
//       );

//       state.cartItems = nextCartItems;

//       localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//       toast.error("Product removed from cart", {
//         position: "bottom-left",
//       });
//     },
//     getTotals(state) {
//       let { total, quantity } = state.cartItems.reduce(
//         (cartTotal, cartItem) => {
//           const { price, cartQuantity } = cartItem;
//           const itemTotal = price * cartQuantity;

//           cartTotal.total += itemTotal;
//           cartTotal.quantity += cartQuantity;

//           return cartTotal;
//         },
//         {
//           total: 0,
//           quantity: 0,
//         }
//       );
//       total = parseFloat(total.toFixed(2));
//       state.cartTotalQuantity = quantity;
//       state.cartTotalAmount = total;
//     },
//     clearCart(state) {
//       state.cartItems = [];
//       localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//       toast.error("Cart cleared", { position: "bottom-left" });
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCart.fulfilled, (state, action) => {
//         state.cartItems = action.payload;
//         state.cartTotalQuantity = state.cartItems.reduce(
//           (acc, item) => acc + item.cartQuantity,
//           0
//         );
//         state.cartTotalAmount = state.cartItems.reduce(
//           (acc, item) => acc + item.cartQuantity * item.price,
//           0
//         );
//         localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//       })
//       .addCase(syncCart.fulfilled, (state, action) => {
//         state.cartItems = action.payload;
//         state.cartTotalQuantity = state.cartItems.reduce(
//           (acc, item) => acc + item.cartQuantity,
//           0
//         );
//         state.cartTotalAmount = state.cartItems.reduce(
//           (acc, item) => acc + item.cartQuantity * item.price,
//           0
//         );
//         localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//       });
//   },
// });

// export const { addToCart, decreaseCart, removeFromCart, getTotals, clearCart } =
//   cartSlice.actions;

// export default cartSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";

// const initialState = {
//   cartItems: localStorage.getItem("cartItems")
//     ? JSON.parse(localStorage.getItem("cartItems"))
//     : [],
//   cartTotalQuantity: 0,
//   cartTotalAmount: 0,
//   userId: null,
// };
// console.log("INITIAL STATE CART", initialState);
// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart(state, action) {
//       const existingIndex = state.cartItems.findIndex(
//         (item) => item._id === action.payload._id
//       );
//       console.log("ACTION", action);
//       console.log("ACTION PAYLOAD", action.payload);
//       if (existingIndex >= 0) {
//         state.cartItems[existingIndex] = {
//           ...state.cartItems[existingIndex],
//           cartQuantity: state.cartItems[existingIndex].cartQuantity + 1,
//         };
//         toast.info("Increased product quantity", {
//           position: "bottom-left",
//         });
//       } else {
//         let tempProductItem = { ...action.payload, cartQuantity: 1 };
//         state.cartItems.push(tempProductItem);
//         toast.success("Product added to cart", {
//           position: "bottom-left",
//         });
//       }
//       localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//     },
//     decreaseCart(state, action) {
//       const itemIndex = state.cartItems.findIndex(
//         (item) => item._id === action.payload._id
//       );

//       if (state.cartItems[itemIndex].cartQuantity > 1) {
//         state.cartItems[itemIndex].cartQuantity -= 1;

//         toast.info("Decreased product quantity", {
//           position: "bottom-left",
//         });
//       } else if (state.cartItems[itemIndex].cartQuantity === 1) {
//         const nextCartItems = state.cartItems.filter(
//           (item) => item._id !== action.payload._id
//         );

//         state.cartItems = nextCartItems;

//         toast.error("Product removed from cart", {
//           position: "bottom-left",
//         });
//       }

//       localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//     },
//     // removeFromCart(state, action) {
//     //   state.cartItems.map((cartItem) => {
//     //     if (cartItem._id === action.payload._id) {
//     //       const nextCartItems = state.cartItems.filter(
//     //         (item) => item._id !== cartItem._id
//     //       );

//     //       state.cartItems = nextCartItems;

//     //       toast.error("Product removed from cart", {
//     //         position: "bottom-left",
//     //       });
//     //     }
//     //     localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//     //     return state;
//     //   });
//     // },
//     removeFromCart(state, action) {
//       const nextCartItems = state.cartItems.filter(
//         (item) => item._id !== action.payload._id
//       );

//       state.cartItems = nextCartItems;

//       localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//       toast.error("Product removed from cart", {
//         position: "bottom-left",
//       });
//     },

//     getTotals(state, action) {
//       let { total, quantity } = state.cartItems.reduce(
//         (cartTotal, cartItem) => {
//           const { price, cartQuantity } = cartItem;
//           const itemTotal = price * cartQuantity;

//           cartTotal.total += itemTotal;
//           cartTotal.quantity += cartQuantity;

//           return cartTotal;
//         },
//         {
//           total: 0,
//           quantity: 0,
//         }
//       );
//       total = parseFloat(total.toFixed(2));
//       state.cartTotalQuantity = quantity;
//       state.cartTotalAmount = total;
//     },
//     clearCart(state, action) {
//       state.cartItems = [];
//       localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//       toast.error("Cart cleared", { position: "bottom-left" });
//     },
//   },
// });

// export const { addToCart, decreaseCart, removeFromCart, getTotals, clearCart } =
//   cartSlice.actions;

// export default cartSlice.reducer;
