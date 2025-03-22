import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { url, setHeaders } from "../../api";

const initialState = {
  cart: null,
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  status: "idle", //неактивний
  error: null,
};

// Asynchronous thunk actions (перетворювачі (оедюсери) асинхронних дій)
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/cart/${userId}`, setHeaders());
      console.log("RESPONSE FETCH CART", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, userName, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url}/cart/add`,
        { userId, userName, productId, quantity },
        setHeaders()
      );
      toast.success("Product added to cart", {
        position: "bottom-left",
      });
      return response.data;
    } catch (error) {
      toast.error("Failed to add product to cart", {
        position: "bottom-left",
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const decreaseCart = createAsyncThunk(
  "cart/decreaseCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url}/cart/decrease`,
        { userId, productId, quantity },
        setHeaders()
      );
      toast.info("Decreased product quantity", {
        position: "bottom-left",
      });
      return response.data;
    } catch (error) {
      toast.error("Failed to decrease product quantity", {
        position: "bottom-left",
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url}/cart/remove`,
        { userId, productId },
        setHeaders()
      );
      toast.error("Product removed from cart", {
        position: "bottom-left",
      });
      return response.data;
    } catch (error) {
      toast.error("Failed to remove product from cart", {
        position: "bottom-left",
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url}/cart/clear`,
        { userId },
        setHeaders()
      );
      toast.error("Cart cleared", {
        position: "bottom-left",
      });
      return response.data;
    } catch (error) {
      toast.error("Failed to clear cart", {
        position: "bottom-left",
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTotals = createAsyncThunk(
  "cart/fetchTotals",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url}/cart/totals/${userId}`,
        setHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(decreaseCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
      })
      .addCase(fetchTotals.fulfilled, (state, action) => {
        state.cartTotalQuantity = action.payload.quantity;
        state.cartTotalAmount = action.payload.total;
      });
  },
});

export default cartSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { url, setHeaders } from "../../api";
// // import { url, setHeaders } from "../../slices/api";

// // Async thunks
// export const fetchCart = createAsyncThunk(
//   "cart/fetchCart",
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${url}/cart/${userId}`, setHeaders());
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const addToCart = createAsyncThunk(
//   "cart/addToCart",
//   async ({ userId, productId, quantity }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${url}/cart/add`,
//         { userId, productId, quantity },
//         setHeaders()
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const removeFromCart = createAsyncThunk(
//   "cart/removeFromCart",
//   async ({ userId, productId, quantity }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${url}/cart/remove`,
//         { userId, productId, quantity },
//         setHeaders()
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const clearCart = createAsyncThunk(
//   "cart/clearCart",
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${url}/cart/clear`,
//         { userId },
//         setHeaders()
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Initial state
// const initialState = {
//   cart: null,
//   status: "idle",
//   error: null,
// };

// // Slice
// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCart.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchCart.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.cart = action.payload;
//       })
//       .addCase(fetchCart.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(addToCart.fulfilled, (state, action) => {
//         state.cart = action.payload;
//       })
//       .addCase(removeFromCart.fulfilled, (state, action) => {
//         state.cart = action.payload;
//       })
//       .addCase(clearCart.fulfilled, (state, action) => {
//         state.cart = null;
//       });
//   },
// });

// export default cartSlice.reducer;
