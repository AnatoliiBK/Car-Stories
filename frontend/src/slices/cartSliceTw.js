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
    console.log("addToCart Slice:", {
      userId,
      productId,
      quantity,
    });
    const response = await axios.post(
      `${url}/cart/add`,
      { userId, productId, quantity },
      setHeaders()
    );
    console.log("Received response from server:", response.data);
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
        state.cartItems = action.payload.items;
        state.cartTotalQuantity = action.payload.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.cartTotalAmount = action.payload.items.reduce(
          (total, item) => total + item.productId.price * item.quantity,
          0
        );
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
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
