import React from "react";
// import ReactDOM from "react-dom";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import productsReducer, { productsFetch } from "./slices/productsSlice";
// import cartReducer, { getTotals } from "./slices/cartSlice";
import cartReducer from "./features/cart/cartSlice";
import authReducer from "./slices/authSlice";
import { productsApi } from "./slices/productsApi";
import ordersSlice from "./slices/ordersSlice";
import usersSlice from "./slices/usersSlice";
import favoritesReducer from "./slices/favoritesSlice";
import viewedCarsReducer from "./slices/viewedCarsSlice";

const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersSlice,
    users: usersSlice,
    cart: cartReducer,
    auth: authReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    favorites: favoritesReducer,
    viewedCars: viewedCarsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
  devTools: {
    serialize: false, // Вимикає автоматичне серіалізування, що впливає на формат даних в localeStorage
  },
});

store.dispatch(productsFetch());
// store.dispatch(getTotals());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
// ReactDOM.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>,
//   document.getElementById("root")
// );
