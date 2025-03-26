import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { url, setHeaders } from "./api";
import { toast } from "react-toastify";

const initialState = {
  token: localStorage.getItem("token"),
  name: "",
  email: "",
  _id: "",
  isAdmin: "", // Clear isAdmin on logout
  registerStatus: "",
  registerError: "",
  loginStatus: "",
  loginError: "",
  userLoaded: false,
  // uploadAvatarStatus: null,
  // uploadAvatarErro: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (values, { rejectWithValue }) => {
    try {
      const token = await axios.post(`${url}/register`, {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      localStorage.setItem("token", token.data);

      return token.data;
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values, { rejectWithValue }) => {
    try {
      const token = await axios.post(`${url}/login`, {
        email: values.email,
        password: values.password,
      });

      console.log("token.data:", token.data, typeof token.data);
      localStorage.setItem("token", token.data);
      return token.data;
    } catch (error) {
      console.log(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (id, { rejectWithValue }) => {
    try {
      const token = await axios.get(`${url}/user/${id}`, setHeaders());

      localStorage.setItem("token", token.data);
      // if (typeof token.data === "string") {
      //   localStorage.setItem("token", token.data);
      // } else if (token.data.token) {
      //   localStorage.setItem("token", token.data.token);
      // } else {
      //   console.error("Unexpected token format:", token.data);
      // }

      return token.data;
    } catch (error) {
      console.log(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

// // Асинхронна функцію uploadAvatar за допомогою createAsyncThunk:
// // Ця функція буде відповідати за завантаження аватара користувача на сервер.
// export const uploadAvatar = createAsyncThunk(
//   "auth/uploadAvatar",
//   async (formData, { rejectWithValue }) => {
//     try {
//       console.log("Uploading image data:", formData); // Лог перед відправкою на сервер
//       const response = await axios.post(
//         `${url}/users/upload-avatar`,
//         formData,
//         setHeaders()
//       );
//       return response.data; // Повертаємо дані з сервера
//     } catch (error) {
//       console.log("ERROR AVATAR SLICE", error.response.data);
//       return rejectWithValue(error.response.data); // Повертаємо помилку
//     }
//   }
// );

// ця функція є в userSlice.js і використовується в NavBar саме з userSlice.js
export const updateUserName = createAsyncThunk(
  "auth/updateUserName",
  async ({ userId, name }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${url}/users/${userId}/update-name`,
        { name }, // Передаємо нове ім'я в MongoDB розділ users, нове бо запит patch
        setHeaders()
      );
      return response.data; // Передаємо оновлені дані назад

      // const token = response.data; // Припускаємо, що сервер повертає новий токен
      // console.log("TOKEN AUTH SLISE", token);
      // if (token) {
      //   localStorage.setItem("token", token); // Зберігаємо лише валідний токен
      // } else {
      //   console.error("Server did not return a token.");
      // }

      // return token; // Повертаємо токен
    } catch (error) {
      console.error(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 1 варіант без перевірки на ваоідність токену
    // loadUser(state, action) {
    //   const token = state.token;

    //   if (token) {
    //     const user = jwtDecode(token);
    //     return {
    //       ...state,
    //       token,
    //       name: user.name,
    //       email: user.email,
    //       _id: user._id,
    //       isAdmin: user.isAdmin,
    //       userLoaded: true,
    //     };
    //   } else return { ...state, userLoaded: true };
    // },

    // 2 варіант з перевіркою токена
    loadUser(state, action) {
      const token = localStorage.getItem("token");

      if (token && token.split(".").length === 3) {
        try {
          const user = jwtDecode(token);
          return {
            ...state,
            token,
            name: user.name,
            email: user.email,
            _id: user._id,
            isAdmin: user.isAdmin,
            userLoaded: true,
          };
        } catch (error) {
          console.error("Failed to decode token:", error);
          localStorage.removeItem("token");
          return { ...state, token: "", userLoaded: true };
        }
      } else {
        console.warn("Invalid or missing token.");
        localStorage.removeItem("token");
        return { ...state, token: "", userLoaded: true };
      }
    },

    // // варіант з очищенням глобального стану у разі помилки і перенаправлення на
    // // сторінку login але працює не зупиняючись
    // loadUser(state, action) {
    //   const token = localStorage.getItem("token");

    //   // Перевіряємо валідність токена
    //   if (!token || token.split(".").length !== 3) {
    //     console.warn("Invalid or missing token.");
    //     localStorage.removeItem("token");
    //     window.location.href = "/login"; // Перенаправляємо на сторінку входу
    //     return { ...state, token: "", userLoaded: true };
    //   }

    //   try {
    //     const user = jwtDecode(token);
    //     return {
    //       ...state,
    //       token,
    //       name: user.name,
    //       email: user.email,
    //       _id: user._id,
    //       isAdmin: user.isAdmin,
    //       userLoaded: true,
    //     };
    //   } catch (error) {
    //     console.error("Failed to decode token:", error);
    //     localStorage.removeItem("token");
    //     window.location.href = "/login"; // Перенаправляємо на сторінку входу
    //     return { ...state, token: "", userLoaded: true };
    //   }
    // },

    logoutUser(state, action) {
      localStorage.removeItem("token");

      return {
        ...state,
        token: "",
        name: "",
        email: "",
        _id: "",
        isAdmin: "",
        registerStatus: "",
        registerError: "",
        loginStatus: "",
        loginError: "",
        avatar: "", // Додаємо очищення аватара
      };
    },
    // updateUserName(state, action) {
    //   // Оновлення тільки локального стану імені
    //   state.name = action.payload.name;
    // },
  },
  // Логіка обробки результатів завантаження в extraReducers:
  // Це дозволить змінювати стан authSlice в залежності від результату операції
  // завантаження аватара чи ін.
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, action) => {
        return { ...state, registerStatus: "pending" };
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        // action.payload - дані, які повернулися після успішного реєстраційного запиту
        if (action.payload) {
          // Декодується токен аутентифікації за допомогою jwtDecode(action.payload)
          //  для отримання даних про користувача(ім'я, email, _id та ін.)
          const user = jwtDecode(action.payload);

          // Призначається новий стан з даними, які отримані з декодованого токену
          return {
            ...state,
            token: action.payload, // даний токен аутентифікації
            name: user.name,
            email: user.email,
            _id: user._id,
            isAdmin: user.isAdmin, // Ensure isAdmin is set переконатися що встановлено isAdmin true чи false
            registerStatus: "success",
          };
        } else return state;
      })
      .addCase(registerUser.rejected, (state, action) => {
        return {
          ...state,
          registerStatus: "rejected",
          registerError: action.payload,
        };
      })
      .addCase(loginUser.pending, (state, action) => {
        return { ...state, loginStatus: "pending" };
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // action.payload - дані, які повернулися після успішного реєстраційного запиту
        if (action.payload) {
          // Декодується токен аутентифікації за допомогою jwtDecode(action.payload)
          //  для отримання даних про користувача(ім'я, email, _id та ін.)
          const user = jwtDecode(action.payload);

          // Призначається новий стан з даними, які отримані з декодованого токену
          return {
            ...state,
            token: action.payload, // даний токен аутентифікації
            name: user.name,
            email: user.email,
            _id: user._id,
            isAdmin: user.isAdmin, // Ensure isAdmin is set переконатися що встановлено isAdmin true чи false // Ensure this field is included
            loginStatus: "success",
          };
        } else return state;
      })
      .addCase(loginUser.rejected, (state, action) => {
        return {
          ...state,
          loginStatus: "rejected",
          loginError: action.payload,
        };
      })
      .addCase(getUser.pending, (state, action) => {
        return {
          ...state,
          getUserStatus: "pending",
        };
      })
      .addCase(getUser.fulfilled, (state, action) => {
        if (action.payload) {
          const user = jwtDecode(action.payload);
          return {
            ...state,
            token: action.payload,
            name: user.name,
            email: user.email,
            _id: user._id,
            getUserStatus: "success",
          };
        } else return state;
      })
      .addCase(getUser.rejected, (state, action) => {
        return {
          ...state,
          getUserStatus: "rejected",
          getUserError: action.payload,
        };
      })
      .addCase(updateUserName.pending, (state) => {
        state.updateStatus = "pending";
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        state.name = action.payload.name; // Оновлення імені локально
        // const user = jwtDecode(action.payload); // Декодуємо новий токен
        // state.name = user.name; // Оновлюємо ім'я
        // state.token = action.payload; // Зберігаємо новий токен
        state.updateStatus = "success";
        toast.success("User name updated successfully!", {
          position: "bottom-left",
        });
      })
      .addCase(updateUserName.rejected, (state, action) => {
        state.updateStatus = "rejected";
        state.updateError = action.payload;
        toast.error(action.payload || "Failed to update user name.", {
          position: "bottom-left",
        });
      });
  },
});

export const { loadUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
