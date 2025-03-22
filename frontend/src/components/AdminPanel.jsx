// 03 01 25
import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client"; // Додаємо WebSocket клієнт  21 01 25
import "./AdminPanel.css";
import { url, setHeaders } from "../slices/api";
import { useTheme } from "../components/ThemeContext";

// console.log("URL IN ADMIN PANEL", url)

const AdminPanel = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false); // Для запобігання повторним клікам
  const { theme } = useTheme();

  useEffect(() => {
    const fetchPendingCars = async () => {
      try {
        console.log("Fetching pending cars...");
        const response = await axios.get(`${url}/cars/pending`, setHeaders());
        console.log("Response ADMIN PANEL:", response.data);
        setCars(response.data);
        setLoading(false);
      } catch (err) {
        setError("Не вдалося завантажити список автомобілів.", err.message);
        setLoading(false); // Завершили завантаження навіть у разі помилки
      }
    };

    fetchPendingCars();
    // Підключення до WebSocket
    const socket = io(url);

    // Слухаємо подію "pending-car-added"
    socket.on("pending-car-added", (newCar) => {
      console.log("Новий автомобіль додано до списку:", newCar);
      // setCars((prevCars) => [newCar, ...prevCars]); // Додаємо новий автомобіль до списку
      setCars((prevCars) => {
        const isDuplicate = prevCars.some((car) => car._id === newCar._id);
        return isDuplicate ? prevCars : [newCar, ...prevCars];
      });
    });

    socket.on("connect_error", (err) => {
      console.error("Помилка підключення до WebSocket:", err.message);
    });

    // Чистимо підключення при розмонтуванні компонента
    return () => {
      socket.off("pending-car-added");
      socket.disconnect();
    };
  }, []);

  const approveCar = async (carId) => {
    try {
      await axios.patch(`${url}/cars/${carId}/approve`, {}, setHeaders());
      setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
      alert("Автомобіль затверджено.");
    } catch (err) {
      alert("Помилка при затвердженні автомобіля.");
    }
  };

  const deleteCar = async (carId) => {
    const confirmDelete = window.confirm(
      "Ви впевнені, що хочете видалити цей автомобіль?"
    );
    if (!confirmDelete) return;

    setProcessing(true); // Блокуємо додаткові дії
    try {
      await axios.delete(`${url}/cars/${carId}`, setHeaders());
      setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
      alert("Автомобіль видалено.");
    } catch (err) {
      console.error("Error deleting car:", err.message);
      alert("Помилка при видаленні автомобіля.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  return (
    // <div className="admin-panel">
    <div className={`admin-panel ${theme}`}>
      <h2>Модерація автомобілів</h2>
      {cars.length === 0 ? (
        <p>Немає автомобілів, що очікують на модерацію 😔.</p>
      ) : (
        <div className="pending-cars">
          {cars.map((car) => (
            <div key={car._id} className={`pending-car ${theme}`}>
              <img src={car.imageUrl} alt={car.name} />
              <h3>{car.name}</h3>
              <p>{car.brand}</p>
              <p>Рік: {car.year}</p>
              <p>Опис: {car.description}</p>
              <button
                onClick={() => approveCar(car._id)}
                className="approve-button"
              >
                Затвердити
              </button>
              <button
                onClick={() => deleteCar(car._id)}
                className="delete-button"
              >
                Видалити
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
