import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setHeaders, url } from "./api";
import { toast } from "react-toastify";

const initialState = {
  ordersList: [],
  status: null,
  editStatus: null, // Додано status для відстеження стану редагування
};

export const ordersFetch = createAsyncThunk("orders/ordersFetch", async () => {
  try {
    const response = await axios.get(`${url}/orders`, setHeaders());
    console.log("ORDERS FETCH : ", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const ordersEdit = createAsyncThunk(
  "orders/ordersEdit",
  async (values, { getState }) => {
    const state = getState();

    let currentOrder = state.orders.ordersList.filter(
      (order) => order._id === values.id
    );

    // console.log("CURRENT ORDER : ", currentOrder);
    // console.log("VALUES ID : ", values.id);
    // console.log("VALUES : ", values);

    const newOrder = {
      ...currentOrder[0],
      delivery_status: values.delivery_status,
    };
    // console.log("NEW ORDER : ", newOrder);
    try {
      const response = await axios.put(
        `${url}/orders/${values.id}`,
        newOrder,
        setHeaders()
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ordersFetch.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(ordersFetch.fulfilled, (state, action) => {
        state.status = "success";
        state.ordersList = action.payload;
      })
      .addCase(ordersFetch.rejected, (state, action) => {
        state.status = "rejected";
      })
      //   .addCase(ordersCreate.pending, (state, action) => {
      //     state.createStatus = "pending";
      //   })
      //   .addCase(ordersCreate.fulfilled, (state, action) => {
      //     state.createStatus = "success";
      //     state.orders.push(action.payload);
      //     toast.success("Order Craated");
      //   })
      //   .addCase(ordersCreate.rejected, (state, action) => {
      //     state.createStatus = "rejected";
      //   })
      //   .addCase(ordersDelete.pending, (state, action) => {
      //     state.deleteStatus = "pending";
      //   })
      //   .addCase(ordersDelete.fulfilled, (state, action) => {
      //     const newordersList = state.orders.filter(
      //       (order) => order._id !== action.payload._id
      //     );
      //     state.orders = newordersList;
      //     state.deleteStatus = "success";
      //     toast.success("Order Deleted");
      //   })
      //   .addCase(ordersDelete.rejected, (state, action) => {
      //     state.deleteStatus = "rejected";
      //   })
      .addCase(ordersEdit.pending, (state, action) => {
        state.editStatus = "pending";
      })
      .addCase(ordersEdit.fulfilled, (state, action) => {
        const updateOrders = state.ordersList?.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
        state.ordersList = updateOrders;
        state.editStatus = "success";
        toast.info("Order Status Edited");
      })
      .addCase(ordersEdit.rejected, (state, action) => {
        state.editStatus = "rejected";
      });
  },
});

export default ordersSlice.reducer;
