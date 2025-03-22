import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setHeaders, url } from "./api";
import { toast } from "react-toastify";

const initialState = {
  usersList: [],
  userId: "",
  // viewedCars: [], // ➕ Додаємо поле для збереження переглянутих авто
  status: null,
  getStatus: null,
  deleteStatus: null,
  uploadAvatarStatus: null,
  uploadAvatarError: null,
};

// Запит для отримання користувачів
export const usersFetch = createAsyncThunk(
  "users/usersFetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/users`, setHeaders());
      console.log("Fetched users:", response.data); // Додатковий лог
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Failed to fetch users.");
    }
  }
);

// Завантаження аватара з перевіркою на сервері
export const uploadAvatar = createAsyncThunk(
  "users/uploadAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("Uploading image data:", formData); // Лог перед відправкою на сервер

      // Відправка POST-запиту на сервер для завантаження аватара
      const response = await axios.post(
        `${url}/users/upload-avatar`, // Використовуємо URL
        formData, // Дані форми, які містять зображення
        setHeaders() // Додаємо заголовки, зокрема токен авторизації
      );

      return response.data; // Повертаємо дані з сервера
    } catch (error) {
      console.log("ERROR AVATAR SLICE", error.response?.data);
      return rejectWithValue(error.response?.data || "Something went wrong"); // Повертаємо помилку
    }
  }
);

// Запит на отримання користувача
export const getUser = createAsyncThunk(
  "users/getUserId",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/users/${id}`, setHeaders());
      console.log("User ID:", response.data._id);
      return response.data._id;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return rejectWithValue("Failed to fetch user ID.");
    }
  }
);

// Видалення користувача
export const userDelete = createAsyncThunk(
  "users/usersDelete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/users/${id}`, setHeaders());
      return response.data;
    } catch (error) {
      console.log(error.response?.data || "Error deleting user.");
      return rejectWithValue("Failed to delete user.");
    }
  }
);

export const updateUserName = createAsyncThunk(
  "users/updateUserName",
  async ({ userId, name }, { rejectWithValue }) => {
    try {
      // axios.patch використовується для часткового оновлення  даних на сервері,
      // наприклад поля nane
      const response = await axios.patch(
        `${url}/users/${userId}/update-name`,
        { name }, // Передаємо нове ім'я, нове бо запит patch
        setHeaders()
      );
      console.log("NAME UPDATE IN USER SLICE", response.data);
      return response.data; // Повертаємо оновлені дані
    } catch (error) {
      console.log("Error updating user name:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Failed to update user name."
      );
    }
  }
);

// Запит для отримання переглянутих авто
export const fetchViewedCars = createAsyncThunk(
  "users/fetchViewedCars",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/users/viewed`, setHeaders());
      return response.data.viewedCars; // Отримуємо переглянуті авто
    } catch (error) {
      console.log("Помилка отримання переглянутих авто:", error);
      return rejectWithValue("Не вдалося отримати переглянуті авто.");
    }
  }
);

// Запит для додавання переглянутого авто
export const addViewedCar = createAsyncThunk(
  "users/addViewedCar",
  async (carId, { rejectWithValue }) => {
    try {
      await axios.post(`${url}/users/viewed`, { carId }, setHeaders());
      return carId; // Повертаємо ID доданого авто
    } catch (error) {
      console.log("Помилка додавання авто до переглянутих:", error);
      return rejectWithValue("Не вдалося додати авто до переглянутих.");
    }
  }
);

// Слайс користувачів
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(usersFetch.pending, (state) => {
        state.status = "pending";
      })
      .addCase(usersFetch.fulfilled, (state, action) => {
        state.status = "success";
        state.usersList = action.payload;
      })
      .addCase(usersFetch.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(getUser.pending, (state) => {
        state.getStatus = "pending";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.getStatus = "success";
        state.userId = action.payload;
        console.log("USER ID FULFILLED ", action.payload);
      })
      .addCase(getUser.rejected, (state, action) => {
        state.getStatus = "rejected";
        console.log("USER ID REJECTED ", action.payload);
      })
      .addCase(userDelete.pending, (state) => {
        state.deleteStatus = "pending";
      })
      .addCase(userDelete.fulfilled, (state, action) => {
        const newusersList = state.usersList.filter(
          (user) => user._id !== action.payload._id
        );
        state.usersList = newusersList;
        state.deleteStatus = "success";
        toast.info("User Deleted", { position: "bottom-left" });
      })
      .addCase(userDelete.rejected, (state, action) => {
        state.deleteStatus = "rejected";
        toast.error(action.payload || "Failed to delete user.", {
          position: "bottom-left",
        });
      })
      .addCase(uploadAvatar.pending, (state) => {
        state.uploadAvatarStatus = "pending";
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.uploadAvatarStatus = "success";

        const updatedUser = state.usersList.find(
          (user) => user._id === action.payload.userId
        );

        if (updatedUser) {
          updatedUser.avatar = action.payload.avatar; // Оновлюємо аватар користувача
        }

        toast.success("Avatar uploaded successfully!", {
          position: "bottom-left",
        });
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.uploadAvatarStatus = "rejected";
        state.uploadAvatarError = action.payload;
        toast.error("Avatar upload failed!", { position: "bottom-left" });
      })
      .addCase(updateUserName.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        state.status = "success";

        // Оновлюємо ім'я користувача у списку користувачів
        const updatedUser = state.usersList.find(
          (user) => user._id === action.payload.userId
        );
        if (updatedUser) {
          updatedUser.name = action.payload.name; // Оновлення імені в списку usersList
        }
        // if (state.auth._id === action.payload.userId) {
        //   state.auth.name = action.payload.name; // Якщо користувач — це поточний користувач, оновлюємо також його ім'я
        // }

        toast.success("User name updated successfully!", {
          position: "bottom-left",
        });
      })
      .addCase(updateUserName.rejected, (state, action) => {
        state.status = "rejected";
        toast.error(action.payload || "Failed to update user name.", {
          position: "bottom-left",
        });
      });
  },
});

export default usersSlice.reducer;

// .addCase(fetchViewedCars.pending, (state) => {
//         state.status = "pending";
//       })
//       .addCase(fetchViewedCars.fulfilled, (state, action) => {
//         state.status = "success";
//         state.viewedCars = action.payload; // Оновлюємо список переглянутих авто
//       })
//       .addCase(fetchViewedCars.rejected, (state) => {
//         state.status = "rejected";
//       })
//       .addCase(addViewedCar.pending, (state) => {
//         state.status = "pending";
//       })
//       .addCase(addViewedCar.fulfilled, (state, action) => {
//         state.status = "success";

//         // Якщо авто ще немає в списку переглянутих, додаємо його
//         if (!state.viewedCars.includes(action.payload)) {
//           state.viewedCars.push(action.payload);
//         }
//       })
//       .addCase(addViewedCar.rejected, (state) => {
//         state.status = "rejected";
//       })

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { setHeaders, url } from "./api";
// import { toast } from "react-toastify";

// const initialState = {
//   usersList: [],
//   userId: "",
//   status: null,
//   getStatus: null,
//   deleteStatus: null,
//   uploadAvatarStatus: null,
//   uploadAvatarError: null,
// };

// export const usersFetch = createAsyncThunk(
//   "users/usersFetch",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${url}/users`, setHeaders());
//       return response.data;
//     } catch (error) {
//       console.log(error);
//       return rejectWithValue("Failed to fetch users.");
//     }
//   }
// );

// export const checkAvatarUrl = createAsyncThunk(
//   "users/checkAvatarUrl",
//   async (avatarUrl, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${url}/users/check-avatar-url`, // новий ендпоінт
//         { avatarUrl }, // передаємо URL аватара для перевірки
//         setHeaders() // Додаємо заголовки з токеном авторизації
//       );
//       return response.data; // Повертаємо результат (exists: true/false)
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Something went wrong");
//     }
//   }
// );

// // Асинхронна функцію uploadAvatar за допомогою createAsyncThunk:
// // Ця функція буде відповідати за завантаження аватара користувача на сервер.
// export const uploadAvatar = createAsyncThunk(
//   "users/uploadAvatar",
//   async (formData, { rejectWithValue }) => {
//     try {
//       console.log("Uploading image data:", formData); // Лог перед відправкою на сервер

//       // Відправка POST-запиту на сервер для завантаження аватару
//       const response = await axios.post(
//         `${url}/users/upload-avatar`, // Використовуємо URL
//         formData, // Дані форми, які містять зображення
//         setHeaders() // Додаємо заголовки, зокрема токен авторизації
//       );
//       return response.data; // Повертаємо дані з сервера
//     } catch (error) {
//       console.log("ERROR AVATAR SLICE", error.response.data);
//       return rejectWithValue(error.response?.data || "Something went wrong"); // Повертаємо помилку
//     }
//   }
// );

// // export const getUser = createAsyncThunk("users/getUserId", async (id) => {
// //   try {
// //     const response = await axios.get(`${url}/users/${id}`, setHeaders());
// //     return response.data._id;
// //   } catch (error) {
// //     console.log(error);
// //   }
// // });

// export const getUser = createAsyncThunk(
//   "users/getUserId",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${url}/users/${id}`, setHeaders());
//       console.log("User ID:", response.data._id);
//       return response.data._id;
//     } catch (error) {
//       console.error("Error fetching user ID:", error);
//       return rejectWithValue("Failed to fetch user ID.");
//       // throw error;
//     }
//   }
// );

// export const userDelete = createAsyncThunk(
//   "users/usersDelete",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.delete(`${url}/users/${id}`, setHeaders());

//       return response.data;
//     } catch (error) {
//       // console.log(error.response.data);
//       console.log(error.response?.data || "Error deleting user.");
//       // toast.error(error.response.data, { position: "bottom-left" }); // перенесено в екстра редюсер .addCase(userDelete.rejected
//       return rejectWithValue("Failed to delete user.");
//     }
//   }
// );

// const usersSlice = createSlice({
//   name: "users",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(usersFetch.pending, (state, action) => {
//         state.status = "pending";
//       })
//       .addCase(usersFetch.fulfilled, (state, action) => {
//         state.status = "success";
//         state.usersList = action.payload;
//       })
//       .addCase(usersFetch.rejected, (state, action) => {
//         state.status = "rejected";
//       })
//       .addCase(getUser.pending, (state, action) => {
//         state.getStatus = "pending";
//       })
//       .addCase(getUser.fulfilled, (state, action) => {
//         state.getStatus = "success";
//         state.userId = action.payload;
//         console.log("USER ID FULFILLED ", action.payload);
//       })
//       .addCase(getUser.rejected, (state, action) => {
//         state.getStatus = "rejected";
//         console.log("USER ID REJECTED ", action.payload);
//       })
//       .addCase(userDelete.pending, (state, action) => {
//         state.deleteStatus = "pending";
//       })
//       .addCase(userDelete.fulfilled, (state, action) => {
//         const newusersList = state.usersList.filter(
//           (user) => user._id !== action.payload._id
//         );
//         state.usersList = newusersList;
//         state.deleteStatus = "success";
//         toast.info("User Deleted", { position: "bottom-left" });
//       })
//       .addCase(userDelete.rejected, (state, action) => {
//         state.deleteStatus = "rejected";
//         toast.error(action.payload || "Failed to fetch users.", {
//           position: "bottom-left",
//         });
//       })
//       // Додаємо обробку checkAvatarUrl
//       .addCase(checkAvatarUrl.pending, (state, action) => {
//         state.checkAvatarUrlStatus = "pending";
//       })
//       .addCase(checkAvatarUrl.fulfilled, (state, action) => {
//         state.checkAvatarUrlStatus = "success";
//         state.avatarExists = action.payload.exists;
//       })
//       .addCase(checkAvatarUrl.rejected, (state, action) => {
//         state.checkAvatarUrlStatus = "rejected";
//         state.checkAvatarUrlError = action.payload;
//       })
//       .addCase(uploadAvatar.pending, (state, action) => {
//         state.uploadAvatarStatus = "pending";
//       })
//       .addCase(uploadAvatar.fulfilled, (state, action) => {
//         state.uploadAvatarStatus = "success";
//         const updatedUser = state.usersList.find(
//           (user) => user._id === action.payload.userId
//         );
//         if (updatedUser) {
//           updatedUser.avatar = action.payload.avatar;
//         }
//         toast.success("Avatar uploaded successfully!", {
//           position: "bottom-left",
//         });
//         // console.log("uploadAvatarStatus", state.uploadAvatarStatus);
//         // state.avatar = action.payload.avatar; // Оновлюємо аватар у стані
//       })
//       .addCase(uploadAvatar.rejected, (state, action) => {
//         state.uploadAvatarStatus = "rejected";
//         state.uploadAvatarError = action.payload;
//         toast.error("Avatar upload failed!", { position: "bottom-left" });
//         // console.log("uploadAvatarError", state.uploadAvatarError);
//         // state.uploadAvatarError = action.payload;
//       });
//   },
// });

// export default usersSlice.reducer;
