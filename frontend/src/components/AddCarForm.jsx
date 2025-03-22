// 03 01 25
import React, { useRef, useState } from "react";
import axios from "axios";
import { url, setHeaders } from "../slices/api";
import "./AddCarForm.css";
import { useTheme } from "../components/ThemeContext";

const AddCarForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    year: "",
    description: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null); // Для зображення попереднього перегляду
  const [message, setMessage] = useState("");
  const [buttonText, setButtonText] = useState("Надіслати"); // Стан для тексту кнопки
  const fileInputRef = useRef(); // Референс для поля вибору файлу
  const { theme } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setButtonText("Надіслати"); // Повертаємо текст кнопки до початкового стану
  };

  // const handleFileChange = (e) => {
  //   setFormData({ ...formData, image: e.target.files[0] });
  // };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Створення посилання на вибраний файл
    } else {
      setPreviewImage(null); // Очистити, якщо файл видалено
    }
    setButtonText("Надіслати"); // Повертаємо текст кнопки до початкового стану
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const form = new FormData();
    form.append("name", formData.name);
    form.append("brand", formData.brand);
    form.append("year", formData.year);
    form.append("description", formData.description);
    form.append("image", formData.image);

    try {
      await axios.post(`${url}/cars`, form, setHeaders());
      setMessage(
        `Автомобіль "${formData.name}" успішно надіслано для модерації.`
      );
      setButtonText("Дані надіслані"); // Змінюємо текст кнопки після успішного надсилання
      setFormData({
        name: "",
        brand: "",
        year: "",
        description: "",
        image: null,
      });
      setPreviewImage(null);
      // Очистити поле файлу
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Помилка при додаванні автомобіля."
      );
    }
  };

  return (
    <form className={`add-car-form ${theme}`} onSubmit={handleSubmit}>
      <h2>Додати автомобіль</h2>
      <input
        type="text"
        name="name"
        placeholder="Назва"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="brand"
        placeholder="Бренд"
        value={formData.brand}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="year"
        placeholder="Рік"
        value={formData.year}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Опис"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="image"
        onChange={handleFileChange}
        accept="image/*"
        required
        ref={fileInputRef} // Прив'язка до референсу
      />
      {previewImage && (
        <div className="image-preview">
          <img src={previewImage} alt="Попередній перегляд" />
        </div>
      )}
      {/* <button type="submit">Надіслати</button> */}
      <button type="submit">{buttonText}</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default AddCarForm;
