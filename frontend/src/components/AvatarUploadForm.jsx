import React, { useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { PrimaryButton, CancelButton } from "./admin/CommonStyled";
import { useDispatch } from "react-redux";
import { uploadAvatar } from "../slices/usersSlice";
import { useTheme } from "./ThemeContext";
import { styled as muiStyled } from "@mui/system";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CryptoJS from "crypto-js"; // Використовуємо crypto-js

const AddAvatar = ({ user, onAvatarUpdate }) => {
  const [avatarImg, setAvatarImg] = useState(null);
  const [avatarHash, setAvatarHash] = useState(null); // Новий стейт для хешу
  const [isFormVisible, setIsFormVisible] = useState(true);

  console.log("AVATAR IMG IN STATE : ", avatarImg)

  const { theme } = useTheme();
  const dispatch = useDispatch();
  const formRef = useRef(null);

  // цей ефект робить відображення попереднього зображення в ImagePreview> при 
  // відкритті вікна редагування без перезавантаження сторінки
  // useEffect(() => {
  //   if (user && user.avatar) {
  //     setAvatarImg(user.avatar);
  //   }
  // }, [user]);

  const handleAvatarImageUpload = (e) => {
    const file = e.target.files[0];
    TransformFile(file);
  };

  const TransformFile = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setAvatarImg(reader.result);
        // Створюємо хеш зображення за допомогою SHA-256 через crypto-js
        const hash = CryptoJS.SHA256(reader.result).toString(CryptoJS.enc.Hex);
        setAvatarHash(hash); // Встановлюємо хеш
      };
    } else {
      setAvatarImg("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (avatarImg && avatarHash) {
      dispatch(
        uploadAvatar({
          image: avatarImg,
          hash: avatarHash,
        })
      );
      onAvatarUpdate(avatarImg); // Передаємо нове зображення назад у NavBar
      setIsFormVisible(false);
    }
  };

  // прибрано useEffect, бо клік поза елементом вже є в NavBar

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (formRef.current && !formRef.current.contains(event.target)) {
  //       setIsFormVisible(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  if (!isFormVisible) return null;

  return (
    <>
      <Overlay onClick={() => setIsFormVisible(false)} />
      <StyledContainer ref={formRef}>
        <StyledHead>
          <h3>
            <strong>Edit Your Avatar</strong>
          </h3>
          <CustomIconButton onClick={() => setIsFormVisible(false)}>
            <CloseIcon />
          </CustomIconButton>
        </StyledHead>
        <StyledAddAvatar>
          <StyledForm theme={theme} onSubmit={handleSubmit}>
            <StyledInput
              type="file"
              accept="image/*"
              onChange={handleAvatarImageUpload}
              required={!avatarImg}
              theme={theme}
            />
            <PrimaryButton type="submit">Save Avatar</PrimaryButton>
          </StyledForm>
          <ImagePreview>
            {avatarImg ? (
              <img src={avatarImg} alt="Avatar Preview" />
            ) : (
              <p>Image preview will appear here</p>
            )}
          </ImagePreview>
        </StyledAddAvatar>
        <CancelButton onClick={() => setIsFormVisible(false)}>Cancel</CancelButton>
      </StyledContainer>
    </>
  );
};

export default AddAvatar;


const StyledContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  @media (min-width: 425px) {
    padding: 1rem 2rem;
  }
`;

const colorChange = keyframes`
  0% {
    color: yellow;
  }
  100% {
    color: green;
  }
`;

const StyledAddAvatar = styled.div`
  display: flex;
  justify-content: space-around;
  padding-right: 5px;
  padding-left: 5px;
  @media (max-width: 768.98px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const StyledHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  h3 {
    margin-bottom: 0;
  }
  animation: ${colorChange} 1s infinite alternate;
`;

const CustomIconButton = muiStyled(IconButton)({
  color: "#1976d2",
  "&:focus": {
    /* transform: scale(1.05); */
    color: "blue",
  },
  "&:hover": {
    /* transform: scale(1.05); */
    color: "blue",
  },
});

const StyledForm = styled.form`
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-top: 2rem;

  background-color: ${({ theme }) => (theme === "dark" ? "#0f0f0f" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
`;

const StyledInput = styled.input`
  padding: 7px;
  min-height: 30px;
  outline: none;
  border-radius: 5px;
  border: 1px solid rgb(182, 182, 182);
  margin: 0.3rem 0;
  background-color: ${({ theme }) => (theme === "dark" ? "#292828" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};

  &:focus {
    border: 2px solid rgb(0, 208, 255);
  }
  &:hover {
    border: 2px solid rgb(0, 208, 255);
  }
`;

const ImagePreview = styled.div`
  margin: 2rem 0 2rem 2rem;
  padding: 2rem;
  border: 1px solid rgb(183, 183, 183);
  max-width: 300px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: rgb(78, 78, 78);
  img {
    max-width: 100%;
  }
  @media (max-width: 768.98px) {
    margin-left: 0;
  }
`;

// import React, { useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import styled from "styled-components";

// const AvatarUploadForm = ({ closeForm }) => {
//   const [avatar, setAvatar] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   const auth = useSelector((state) => state.auth);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setAvatar(file);

//     // Для попереднього перегляду
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreview(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!avatar) return;

//     setUploading(true);
//     setError(null);
//     setSuccess(false);

//     const formData = new FormData();
//     formData.append("avatar", avatar);

//     try {
//       // const config = {
//       //   headers: {
//       //     "Content-Type": "multipart/form-data",
//       //     "x-auth-token": auth.token, // Якщо потрібна аутентифікація
//       //   },
//       // };

//       const { data } = await axios.post(
//         "/api/users/upload-avatar",
//         formData
//         // config
//       );
//       setSuccess(true);
//       console.log("Avatar uploaded:", data.avatar);
//     } catch (err) {
//       setError(err.response?.data?.msg || "Error uploading avatar");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <>
//       <Overlay onClick={closeForm} />
//       <AvatarFormContainer>
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label htmlFor="avatar">Upload Avatar</label>
//             <input
//               type="file"
//               id="avatar"
//               name="avatar"
//               accept="image/*"
//               onChange={handleFileChange}
//             />
//           </div>

//           {preview && (
//             <div>
//               <img
//                 src={preview}
//                 alt="Avatar Preview"
//                 style={{ width: "100px", height: "100px", borderRadius: "50%" }}
//               />
//             </div>
//           )}

//           <button type="submit" disabled={uploading}>
//             {uploading ? "Uploading..." : "Upload Avatar"}
//           </button>

//           {error && <p style={{ color: "red" }}>{error}</p>}
//           {success && (
//             <p style={{ color: "green" }}>Avatar uploaded successfully!</p>
//           )}
//         </form>
//       </AvatarFormContainer>
//     </>
//   );
// };

// export default AvatarUploadForm;

// const AvatarFormContainer = styled.div`
//   position: fixed;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   background-color: white;
//   padding: 20px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
//   border-radius: 8px;
//   z-index: 1000;
// `;

// const Overlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.5);
//   z-index: 999;
// `;

// import React, { useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import styled from "styled-components";

// const AvatarUploadForm = ({ closeForm }) => {
//   const [avatar, setAvatar] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   const [isFormVisible, setIsFormVisible] = useState(true);

//   const closeAvatarForm = () => {
//     setIsFormVisible(false);
//   };

//   const auth = useSelector((state) => state.auth);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setAvatar(file);

//     // Для попереднього перегляду
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreview(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!avatar) return;

//     setUploading(true);
//     setError(null);
//     setSuccess(false);

//     const formData = new FormData();
//     formData.append("avatar", avatar);

//     try {
//       const config = {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           "x-auth-token": auth.token, // Якщо потрібна аутентифікація
//         },
//       };

//       const { data } = await axios.post(
//         "/api/users/upload-avatar",
//         formData,
//         config
//       );
//       setSuccess(true);
//       console.log("Avatar uploaded:", data.avatar);
//     } catch (err) {
//       setError(err.response?.data?.msg || "Error uploading avatar");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <>
//       <Overlay isVisible={isFormVisible} onClick={closeAvatarForm} />
//       <AvatarFormContainer isVisible={isFormVisible}>
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label htmlFor="avatar">Upload Avatar</label>
//             <input
//               type="file"
//               id="avatar"
//               name="avatar"
//               accept="image/*"
//               onChange={handleFileChange}
//             />
//           </div>

//           {preview && (
//             <div>
//               <img
//                 src={preview}
//                 alt="Avatar Preview"
//                 style={{ width: "100px", height: "100px", borderRadius: "50%" }}
//               />
//             </div>
//           )}

//           <button type="submit" disabled={uploading}>
//             {uploading ? "Uploading..." : "Upload Avatar"}
//           </button>

//           {error && <p style={{ color: "red" }}>{error}</p>}
//           {success && (
//             <p style={{ color: "green" }}>Avatar uploaded successfully!</p>
//           )}
//         </form>
//       </AvatarFormContainer>
//     </>
//   );
// };

// export default AvatarUploadForm;

// const AvatarFormContainer = styled.div`
//   position: fixed;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   background-color: white;
//   padding: 20px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
//   border-radius: 8px;
//   z-index: 1000;
// `;

// const Overlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.5);
//   z-index: 999;
// `;






// import React, { useEffect, useRef, useState } from "react";
// import styled, { keyframes } from "styled-components";
// import { PrimaryButton, CancelButton } from "./admin/CommonStyled";
// import { useDispatch, useSelector } from "react-redux";
// import { uploadAvatar } from "../slices/usersSlice";
// import { useTheme } from "./ThemeContext";
// import { styled as muiStyled } from "@mui/system";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";

// const AddAvatar = ({ user, closeForm }) => {
//   const [avatarImg, setAvatarImg] = useState(null);
//   const [isFormVisible, setIsFormVisible] = useState(true);

//   const { theme } = useTheme();
//   const dispatch = useDispatch();
//   const formRef = useRef(null);

//   // Отримуємо поточного користувача з глобального стану
//   // const { usersList } = useSelector((state) => state.users);
//   // const auth = useSelector((state) => state.auth);
//   // const user = usersList.find((u) => u._id === auth._id);
//   // цей код вже використовується в батьківському компоненті NavBar, тому щоб
//   // не дублювати його тут вписуємо пропс user в const AddAvatar = ({ closeForm }) =>...
//   // а в NavBar де є виклик компонента AddAvatar дописуємо user={user}

//   // Встановлюємо початкове значення аватара, якщо він уже є
//   useEffect(() => {
//     if (user && user.avatar) {
//       setAvatarImg(user.avatar);
//     }
//   }, [user]);

//   const handleAvatarImageUpload = (e) => {
//     const file = e.target.files[0];
//     TransformFile(file);
//   };

//   const TransformFile = (file) => {
//     const reader = new FileReader();

//     if (file) {
//       reader.readAsDataURL(file);
//       reader.onloadend = () => {
//         setAvatarImg(reader.result);
//       };
//     } else {
//       setAvatarImg("");
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (avatarImg) {
//       dispatch(
//         uploadAvatar({
//           image: avatarImg,
//         })
//       );
//       setIsFormVisible(false);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (formRef.current && !formRef.current.contains(event.target)) {
//         setIsFormVisible(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   if (!isFormVisible) return null;

//   return (
//     <>
//       <Overlay onClick={() => setIsFormVisible(false)} />
//       <StyledContainer ref={formRef}>
//         <StyledHead>
//           <h3>
//             <strong>Edit Your Avatar</strong>
//           </h3>
//           <CustomIconButton onClick={() => setIsFormVisible(false)}>
//             <CloseIcon />
//           </CustomIconButton>
//         </StyledHead>
//         <StyledAddAvatar>
//           <StyledForm theme={theme} onSubmit={handleSubmit}>
//             <StyledInput
//               type="file"
//               accept="image/*"
//               onChange={handleAvatarImageUpload}
//               required={!avatarImg}
//               theme={theme}
//             />
//             <PrimaryButton type="submit">Save Avatar</PrimaryButton>
//           </StyledForm>
//           <ImagePreview>
//             {avatarImg ? (
//               <img src={avatarImg} alt="Avatar Preview" />
//             ) : (
//               <p>Image preview will appear here</p>
//             )}
//           </ImagePreview>
//         </StyledAddAvatar>
//         <CancelButton onClick={() => setIsFormVisible(false)}>Cancel</CancelButton>
//       </StyledContainer>
//     </>
//   );
// };

// export default AddAvatar;

// import React, { useEffect, useRef, useState } from "react";
// import styled, { keyframes } from "styled-components";
// import { PrimaryButton, CancelButton } from "./admin/CommonStyled";
// import { useDispatch } from "react-redux";
// import { uploadAvatar } from "../slices/usersSlice";
// // import { useNavigate } from "react-router-dom";
// import { useTheme } from "./ThemeContext";

// import { styled as muiStyled } from "@mui/system";

// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";

// const AddAvatar = ({ closeForm }) => {
//   // const [open, setOpen] = React.useState(false);
//   const [avatarImg, setAvatarImg] = useState(null);
//   const [isFormVisible, setIsFormVisible] = useState(true);

//   const { theme } = useTheme(); // Додаємо тему з контексту

//   const dispatch = useDispatch();
//   // const navigate = useNavigate();
//   const formRef = useRef(null); // Створюємо реф для форми

//   // console.log("AVATAR IMG : ", avatarImg);

  

//   const handleAvatarImageUpload = (e) => {
//     const file = e.target.files[0];
//     console.log("SELECTED FILE : ", file);
//     TransformFile(file);
//   };

//   const TransformFile = (file) => {
//     const reader = new FileReader();

//     if (file) {
//       reader.readAsDataURL(file);
//       reader.onloadend = () => {
//         console.log("Transformed file:", reader.result); // Додаємо лог для перевірки перетворення
//         setAvatarImg(reader.result);
//       };
//     } else {
//       setAvatarImg("");
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Image data to be uploaded:", avatarImg); // Лог перед відправкою
//     dispatch(
//       uploadAvatar({
//         image: avatarImg,
//       })
//     );
//     setIsFormVisible(false); // Закриваємо форму після відправки
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (formRef.current && !formRef.current.contains(event.target)) {
//         setIsFormVisible(false); // Закриваємо форму при кліку поза формою
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   if (!isFormVisible) return null; // Якщо форма невидима, не рендеримо компонент

//   return (
//     <>
//       <Overlay onClick={() => setIsFormVisible(false)} />
//       <StyledContainer ref={formRef}>
//         {/* <StyledText>
//         <h3><strong>Add Your Avatar</strong></h3>
//       </StyledText> */}
//         <StyledHead>
//           <h3>
//             <strong>Add Your Avatar</strong>
//           </h3>
//           <CustomIconButton onClick={() => setIsFormVisible(false)}>
//             <CloseIcon />
//           </CustomIconButton>
//         </StyledHead>
//         <StyledAddAvatar>
//           <StyledForm theme={theme} onSubmit={handleSubmit}>
//             <StyledInput
//               type="file"
//               accept="image/" //можна вибрати лише зображення (наприклад, JPEG, PNG, GIF тощо), а не будь-який інший тип файлу
//               onChange={handleAvatarImageUpload}
//               required
//               theme={theme}
//             />
//             <PrimaryButton type="submit">Add Avatar</PrimaryButton>
//           </StyledForm>
//           <ImagePreview>
//             {avatarImg ? (
//               <img src={avatarImg} alt="" />
//             ) : (
//               <p>Image preview will apper here</p>
//             )}
//           </ImagePreview>
//         </StyledAddAvatar>
//         <CancelButton onClick={() => setIsFormVisible(false)}>
//           Cancel
//         </CancelButton>
//       </StyledContainer>
//     </>
//   );
// };

// export default AddAvatar;