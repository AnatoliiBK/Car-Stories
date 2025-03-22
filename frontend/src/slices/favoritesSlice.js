import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const productId = action.payload; // action.payload це дані які при виклику
      //  редусера toggleFavorite оновлять стан компоненту де toggleFavorite буде викликано.
      if (state.includes(productId)) {
        return state.filter((id) => id !== productId);
        // Якщо state вже містить productId, то він видаляється зі списку
        // Якщо продукт уже є в списку улюблених (state), видаляємо його
      } else {
        state.push(productId);
        // productId додається до state за допомогою state.push(productId)
        // Інакше додаємо продукт до списку улюблених
      }
    },
  },
});

// Експорт дії toggleFavorite
export const { toggleFavorite } = favoritesSlice.actions;

// Експорт редюсера по замовчуванню щоб додати його до кореневого редюсера,
// використовуючи configureStore з Redux Toolkit:
export default favoritesSlice.reducer;
