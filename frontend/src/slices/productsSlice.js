import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHeaders, url } from "./api";
import { toast } from "react-toastify";

const initialState = {
  productsList: [],
  status: null,
  createStatus: null,
  deleteStatus: null,
  editStatus: null,
};

export const productsFetch = createAsyncThunk(
  "products/productsFetch",
  async () => {
    try {
      const response = await axios.get(
        `${url}/products`
        // "http://localhost:5000/products"
        // "https://chaoo-online-shop.herokuapp.com/products"
      );
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data);
    }
  }
);

export const productsCreate = createAsyncThunk(
  "products/productsCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}/products`,
        values,
        setHeaders()
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const productsEdit = createAsyncThunk(
  "products/productsEdit",
  async (values) => {
    try {
      const response = await axios.put(
        `${url}/products/${values.product._id}`,
        values,
        setHeaders()
        // "http://localhost:5000/products"
        // "https://chaoo-online-shop.herokuapp.com/products"
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const productsDelete = createAsyncThunk(
  "products/productsDelete",
  async (id) => {
    try {
      const response = await axios.delete(
        `${url}/products/${id}`,
        setHeaders()
        // "http://localhost:5000/products"
        // "https://chaoo-online-shop.herokuapp.com/products"
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(productsFetch.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(productsFetch.fulfilled, (state, action) => {
        state.status = "success";
        state.productsList = action.payload;
      })
      .addCase(productsFetch.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(productsCreate.pending, (state, action) => {
        state.createStatus = "pending";
      })
      .addCase(productsCreate.fulfilled, (state, action) => {
        state.createStatus = "success";
        state.productsList.push(action.payload);
        toast.success("Product Craated");
      })
      .addCase(productsCreate.rejected, (state, action) => {
        state.createStatus = "rejected";
      })
      .addCase(productsDelete.pending, (state, action) => {
        state.deleteStatus = "pending";
      })
      .addCase(productsDelete.fulfilled, (state, action) => {
        const newList = state.productsList.filter(
          (item) => item._id !== action.payload._id
        );
        state.productsList = newList;
        state.deleteStatus = "success";
        toast.success("Product Deleted");
      })
      .addCase(productsDelete.rejected, (state, action) => {
        state.deleteStatus = "rejected";
      })
      .addCase(productsEdit.pending, (state, action) => {
        state.editStatus = "pending";
      })
      .addCase(productsEdit.fulfilled, (state, action) => {
        const updateProduct = state.productsList.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
        state.productsList = updateProduct;
        state.editStatus = "success";
        toast.info("Product Edited");
      })
      .addCase(productsEdit.rejected, (state, action) => {
        state.editStatus = "rejected";
      });
  },
});

export default productsSlice.reducer;
