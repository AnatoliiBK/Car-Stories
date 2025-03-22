import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "./api";

// ➤ Отримати переглянуті авто
export const fetchViewedCars = createAsyncThunk(
  "viewedCars/fetchViewedCars",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/viewed-cars`, setHeaders());
      console.log("FETCH VIEWED CARS IN SLICE : ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Помилка отримання переглянутих авто"
      );
    }
  }
);

// ➤ Додати авто в переглянуті
export const addViewedCar = createAsyncThunk(
  "viewedCars/addViewedCar",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url}/viewed-cars`,
        { carId },
        setHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Помилка додавання авто");
    }
  }
);

// ➤ Видалити авто з переглянутих
export const removeViewedCar = createAsyncThunk(
  "viewedCars/removeViewedCar",
  async (carId, { rejectWithValue }) => {
    try {
      await axios.delete(`${url}/viewed-cars/${carId}`, setHeaders());
      return carId; // Повертаємо ID, щоб видалити його зі стейту
    } catch (error) {
      return rejectWithValue(error.response?.data || "Помилка видалення авто");
    }
  }
);

const viewedCarsSlice = createSlice({
  name: "viewedCars",
  initialState: {
    viewedCars: [],
    status: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchViewedCars.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchViewedCars.fulfilled, (state, action) => {
        state.status = "success";
        state.viewedCars = action.payload;
      })
      .addCase(fetchViewedCars.rejected, (state) => {
        state.status = "error";
      })
      .addCase(addViewedCar.fulfilled, (state, action) => {
        state.viewedCars.push(action.payload);
      })
      .addCase(removeViewedCar.fulfilled, (state, action) => {
        state.viewedCars = state.viewedCars.filter(
          (car) => car._id !== action.payload
        );
      });
  },
});

export default viewedCarsSlice.reducer;
