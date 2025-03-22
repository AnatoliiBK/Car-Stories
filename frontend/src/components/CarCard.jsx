import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CarCard.css"; // Стилі для картки
import { useTheme } from "../components/ThemeContext";
import placeholderAvatar from "../assets/girl face.jpg";
import axios from "axios"; // ✅ Додаємо axios для запитів на сервер
import { io } from "socket.io-client";
import { url, setHeaders } from "../slices/api";

const socket = io(url);

const CarCard = ({ car, isFavorite, isAdmin, currentUser, onDelete }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
   const menuRef = useRef(null); // Посилання на меню

  // 🔹 Перевіряємо, чи користувач — власник авто
  const isOwner = currentUser?._id === car.createdBy?._id;
   const [menuOpen, setMenuOpen] = useState(false);
console.log("IS OWNER : ", isOwner)
  const handleDetailsClick = async () => {
    try {
      // 🔹 Відправляємо запит на сервер для додавання авто в переглянуті
      await axios.post(`${url}/viewed-cars`, { carId: car._id }, setHeaders());

      // 🔹 Якщо запит успішний – відправляємо WebSocket подію
      socket.emit("viewed-updated");

      // 🔹 Переходимо на сторінку деталей авто
      navigate(`/cars/${car._id}`);
    } catch (error) {
      console.error("Помилка додавання в переглянуті:", error.message);
    }
  };

  // 🔹 Переключення меню
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // 🔹 Закриття меню при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    // <div className="car-card"> // без теми
    <div className={`car-card ${theme}`}>
      {isFavorite && <div className="favorite-indicator">✨</div>}{" "}
      {/* Індикатор */}
      <img src={car.imageUrl} alt={car.name} className="car-image" />
      {(isAdmin || isOwner) && (
        <div className="menu-container" ref={menuRef}>
          <button className={`menu-button ${theme}`} onClick={toggleMenu}>
            ⋮
          </button>
          {menuOpen && (
            <div className={`dropdown-menu ${theme}`}>
              <button
                className={`edit-item ${theme}`}
                onClick={() => navigate(`/cars/edit/${car._id}`)}
              >
                ✏️ Редагувати
              </button>
              {isAdmin && (
                <button
                  className={`delete-item ${theme}`}
                  onClick={() => onDelete(car._id)}
                >
                  🗑 Видалити
                </button>
              )}
            </div>
          )}
        </div>
      )}
      <h3>
        {car.brand} {car.name}
      </h3>
      {/* <p>{car.brand}</p>
      <p>{car.name}</p> */}
      <p>Рік: {car.year}</p>
      {/* Власник автомобіля */}
      <div className="car-owner">
        <img
          src={car.createdBy?.avatar || placeholderAvatar}
          alt={car.createdBy?.name}
          className="owner-avatar"
        />
        <span className="owner-name">{car.createdBy?.name}</span>
        <button
          className={`specs-button ${theme}`}
          onClick={() => navigate(`/car-specs/${car._id}`)}
        >
          Дещо більше
        </button>
      </div>
      {/* Адміністративні дії */}
      {/* {isAdmin && (
        <div className="admin-actions">
          <button
            className="admin-button edit-button"
            onClick={() => alert("Редагувати авто!")}
          >
            Редагувати
          </button>
          <button
            className="admin-button delete-button"
            onClick={() => onDelete(car._id)}
          >
            Видалити
          </button>
        </div>
      )} */}
      {/* Дії для адміністратора або власника */}
      {/* Меню дій (редагування/видалення) */}
      
      {/* {(isAdmin || isOwner) && (
        <div className="admin-actions">
          <button
            className="admin-button edit-button"
            onClick={() => navigate(`/cars/edit/${car._id}`)}
          >
            Редагувати
          </button>
          {isAdmin && (
            <button
              className="admin-button delete-button"
              onClick={() => onDelete(car._id)}
            >
              Видалити
            </button>
          )}
        </div>
      )} */}
      <button className="details-button" onClick={handleDetailsClick}>
        Деталі
      </button>
    </div>
  );
};

export default CarCard;

// const handleDetailsClick = () => {
//   socket.emit("viewed-car"); // Надсилаємо подію на сервер
//   navigate(`/cars/${car._id}`); // Перенаправляємо на сторінку деталей
// };

// const handleDetailsClick = () => {
//   const viewedCars = JSON.parse(localStorage.getItem("viewedCars")) || [];

//   if (!viewedCars.some((viewedCar) => viewedCar._id === car._id)) {
//     const updatedViewedCars = [...viewedCars, car];
//     localStorage.setItem("viewedCars", JSON.stringify(updatedViewedCars));

//     // 📢 Відправляємо подію в `storage`, щоб інші вкладки теж оновилися
//   window.dispatchEvent(new Event("storage"));

//   // Надсилаємо подію WebSocket
//   socket.emit("viewed-car");
//   }

//   // socket.emit("viewed-car"); // Надсилаємо подію на сервер
//   navigate(`/cars/${car._id}`);
// };
