// import { createSelector } from "reselect";

// export const selectCartItems = (state, userId) =>
//   state.cart.items[userId] || [];

// export const selectCartTotalQuantity = createSelector(
//   [selectCartItems],
//   (items) => items.length
// );
export const selectCartTotalQuantity = (state, userId) => {
  if (!state.cart.cartItems[userId]) {
    return 0;
  }
  return state.cart.cartItems[userId].reduce(
    (total, item) => total + item.cartQuantity,
    0
  );
};
