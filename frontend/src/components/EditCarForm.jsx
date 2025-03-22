import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { url, setHeaders } from "../slices/api";
import "./EditCarForm.css"; // ✅ Додаємо стилі
// import Loader from "./Loader"; // ✅ Якщо є компонент лоадера
import { useTheme } from "../components/ThemeContext";

const EditCarForm = ({ onClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const formRef = useRef(null); // 🔹 Створюємо посилання на форму

  const [car, setCar] = useState({
    name: "",
    brand: "",
    year: "",
    description: "",
    imageUrl: "",
  });

  const [image, setImage] = useState(null); // Збереження файлу зображення
  const [preview, setPreview] = useState(""); // URL для прев'ю

  useEffect(() => {
    axios
      .get(`${url}/cars/${id}`)
      .then((res) => {
        setCar(res.data);
        setPreview(res.data.imageUrl); // Встановлюємо поточне зображення
      })
      .catch((err) => console.error("Помилка завантаження авто:", err));
  }, [id]);

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Оновлюємо прев’ю
    }
  };

  // 🔹 Закриваємо форму при кліку поза нею
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        // onClose(); // Викликаємо функцію закриття
        if (onClose) onClose();  // ✅ Перевіряємо, чи є onClose перед викликом
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", car.name);
    formData.append("brand", car.brand);
    formData.append("year", car.year);
    formData.append("description", car.description);
    if (image) formData.append("image", image); // Додаємо зображення, якщо змінене

    try {
      await axios.put(`${url}/cars/${id}`, formData, setHeaders());
      alert("Автомобіль оновлено!");
      navigate(`/cars/${id}`);
    } catch (err) {
      console.error("Помилка оновлення авто:", err);
    }
  };

  return (
    <div className={`edit-car-overlay ${theme}`}>
      <div className={`edit-car-form ${theme}`} ref={formRef}>
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2>Редагування автомобіля</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label>Назва:</label>
          <input
            type="text"
            name="name"
            value={car.name}
            onChange={handleChange}
            required
            className={`edit-area ${theme}`}
          />

          <label>Марка:</label>
          <input
            type="text"
            name="brand"
            value={car.brand}
            onChange={handleChange}
            required
            className={`edit-area ${theme}`}
          />

          <label>Рік випуску:</label>
          <input
            type="number"
            name="year"
            value={car.year}
            onChange={handleChange}
            required
            className={`edit-area ${theme}`}
          />

          <label>Опис:</label>
          <textarea
            name="description"
            value={car.description}
            onChange={handleChange}
            className={`edit-area ${theme}`}
          />

          <label>Зображення:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={`edit-area ${theme}`}
          />

          {preview && (
            <img src={preview} alt="Прев'ю" className="preview-img" />
          )}

          <button className="button-submit" type="submit">
            Зберегти зміни
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCarForm;

// const EditCarForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [car, setCar] = useState({
//     name: "",
//     brand: "",
//     year: "",
//     description: "",
//     imageUrl: "",
//   });

//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     const fetchCar = async () => {
//       setLoading(true);
//       try {
//         const { data } = await axios.get(`${url}/cars/${id}`);
//         setCar({
//           name: data.name,
//           brand: data.brand,
//           year: data.year,
//           description: data.description,
//           imageUrl: data.imageUrl,
//         });
//       } catch (error) {
//         console.error("Помилка завантаження автомобіля:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCar();
//   }, [id]);

//   const handleChange = (e) => {
//     setCar({ ...car, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       let updatedCar = { ...car };

//       if (image) {
//         const formData = new FormData();
//         formData.append("image", image);

//         const uploadRes = await axios.post(`${url}/upload`, formData, setHeaders());
//         updatedCar.imageUrl = uploadRes.data.secure_url;
//       }

//       await axios.put(`${url}/cars/${id}`, updatedCar, setHeaders());

//       navigate(`/cars/${id}`);
//     } catch (error) {
//       console.error("Помилка редагування:", error.message);
//     } finally {
//       setSaving(false);
//     }
//   };

// //   if (loading) return <Loader />; // Показуємо лоадер під час завантаження

//   return (
//     <div className="edit-car-container">
//       <h2>Редагування авто</h2>
//       <form className="edit-car-form" onSubmit={handleSubmit}>
//         <label>Назва:</label>
//         <input type="text" name="name" value={car.name} onChange={handleChange} required />

//         <label>Бренд:</label>
//         <input type="text" name="brand" value={car.brand} onChange={handleChange} required />

//         <label>Рік:</label>
//         <input type="number" name="year" value={car.year} onChange={handleChange} required />

//         <label>Опис:</label>
//         <textarea name="description" value={car.description} onChange={handleChange} required />

//         <label>Зображення:</label>
//         <div className="image-preview">
//           <img src={car.imageUrl} alt="Авто" />
//         </div>
//         <input type="file" accept="image/*" onChange={handleImageChange} />

//         <button type="submit" className="save-button" disabled={saving}>
//           {saving ? "Збереження..." : "Оновити"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditCarForm;

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { url, setHeaders } from "../slices/api"; // ✅ Використовуємо готові змінні

// const EditCarForm = () => {
//   const { id } = useParams(); // Отримуємо ID авто з URL
//   const navigate = useNavigate();

//   const [car, setCar] = useState({
//     name: "",
//     brand: "",
//     year: "",
//     description: "",
//     imageUrl: "",
//   });

//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // 🔹 Отримуємо поточні дані авто
//   useEffect(() => {
//     const fetchCar = async () => {
//       try {
//         const { data } = await axios.get(`${url}/cars/${id}`);
//         setCar({
//           name: data.name,
//           brand: data.brand,
//           year: data.year,
//           description: data.description,
//           imageUrl: data.imageUrl,
//         });
//       } catch (error) {
//         console.error("Помилка завантаження даних автомобіля:", error.message);
//       }
//     };

//     fetchCar();
//   }, [id]);

//   // 🔹 Обробник оновлення полів
//   const handleChange = (e) => {
//     setCar({ ...car, [e.target.name]: e.target.value });
//   };

//   // 🔹 Обробник завантаження зображення
//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   // 🔹 Відправка форми
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let updatedCar = { ...car };

//       // Якщо є нове зображення – завантажуємо його на сервер
//       if (image) {
//         const formData = new FormData();
//         formData.append("image", image);

//         const uploadRes = await axios.post(`${url}/upload`, formData, setHeaders());
//         updatedCar.imageUrl = uploadRes.data.secure_url;
//       }

//       // Оновлення автомобіля
//       await axios.put(`${url}/cars/${id}`, updatedCar, setHeaders());

//       navigate(`/cars/${id}`); // Переходимо назад на сторінку авто
//     } catch (error) {
//       console.error("Помилка редагування авто:", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Редагування авто</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="text" name="name" value={car.name} onChange={handleChange} placeholder="Назва" required />
//         <input type="text" name="brand" value={car.brand} onChange={handleChange} placeholder="Бренд" required />
//         <input type="number" name="year" value={car.year} onChange={handleChange} placeholder="Рік" required />
//         <textarea name="description" value={car.description} onChange={handleChange} placeholder="Опис" required />

//         <div>
//           <img src={car.imageUrl} alt="Зображення авто" width="150" />
//           <input type="file" accept="image/*" onChange={handleImageChange} />
//         </div>

//         <button type="submit" disabled={loading}>
//           {loading ? "Збереження..." : "Оновити"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditCarForm;

// import React, { useState, useEffect } from "react";

// const EditCarForm = ({ carId, onSuccess }) => {
//   const [carData, setCarData] = useState({
//     name: "",
//     brand: "",
//     year: "",
//     description: "",
//     image: null,
//   });

//   const [previewImage, setPreviewImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     // Отримуємо дані автомобіля за ID
//     fetch(`/api/cars/${carId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setCarData({
//           name: data.name,
//           brand: data.brand,
//           year: data.year,
//           description: data.description,
//           image: null, // Оновимо при завантаженні нового
//         });
//         setPreviewImage(data.imageUrl); // Відображаємо поточне зображення
//       })
//       .catch((err) => setError("Помилка завантаження даних автомобіля"));
//   }, [carId]);

//   const handleChange = (e) => {
//     setCarData({ ...carData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setCarData({ ...carData, image: file });

//     // Попередній перегляд зображення
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setPreviewImage(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const formData = new FormData();
//     formData.append("name", carData.name);
//     formData.append("brand", carData.brand);
//     formData.append("year", carData.year);
//     formData.append("description", carData.description);
//     if (carData.image) {
//       formData.append("image", carData.image);
//     }

//     try {
//       const response = await fetch(`/api/cars/${carId}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: formData,
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Помилка редагування");

//       onSuccess(); // Виклик функції після успішного оновлення
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="edit-car-form">
//       {error && <p className="error">{error}</p>}

//       <label>Назва:</label>
//       <input
//         type="text"
//         name="name"
//         value={carData.name}
//         onChange={handleChange}
//         required
//       />

//       <label>Марка:</label>
//       <input
//         type="text"
//         name="brand"
//         value={carData.brand}
//         onChange={handleChange}
//         required
//       />

//       <label>Рік випуску:</label>
//       <input
//         type="number"
//         name="year"
//         value={carData.year}
//         onChange={handleChange}
//         required
//       />

//       <label>Опис:</label>
//       <textarea
//         name="description"
//         value={carData.description}
//         onChange={handleChange}
//         required
//       />

//       <label>Зображення:</label>
//       <input type="file" accept="image/*" onChange={handleImageChange} />
//       {previewImage && <img src={previewImage} alt="Preview" className="preview" />}

//       <button type="submit" disabled={loading}>
//         {loading ? "Оновлення..." : "Оновити автомобіль"}
//       </button>
//     </form>
//   );
// };

// export default EditCarForm;
