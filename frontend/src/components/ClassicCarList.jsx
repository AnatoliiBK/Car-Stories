import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./CarList.css";
import CarCard from "./CarCard";
import SearchBar from "./SearchBar";
import { url, setHeaders } from "../slices/api";

const ClassicCarList = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [carName, setCarName] = useState(""); // Для пошуку за назвою
  const [carModel, setCarModel] = useState("");
  const [year, setYear] = useState(""); // Для пошуку за роком
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCarsAndFavorites = async () => {
      try {
        const [carResponse, favoriteResponse, userResponse] = await Promise.all(
          [
            axios.get(`${url}/cars`),
            axios.get(`${url}/favorites`, setHeaders()),
            axios.get(`${url}/users/me`, setHeaders()), // Перевіряємо роль
          ]
        );

        const classicCars = carResponse.data.filter((car) => car.year < 1987);
        setCars(classicCars);
        setFavorites(favoriteResponse.data.map((fav) => fav.car?._id)); // ID улюблених
        setIsAdmin(userResponse.data.isAdmin); // Роль користувача
        setCurrentUser(userResponse.data); // Зберігаємо поточного користувача
        setLoading(false);
      } catch (err) {
        console.error("Помилка завантаження даних:", err);
        setError("Не вдалося завантажити список автомобілів.");
        setLoading(false);
      }
    };

    fetchCarsAndFavorites();

    // Підключення до WebSocket
    const socket = io(url);

    const handleNewCar = (newCar) => {
      if (newCar.year < 1987) {
        setCars((prevCars) => {
          if (prevCars.some((car) => car._id === newCar._id)) return prevCars;
          return [newCar, ...prevCars];
        });
      }
    };

    const handleCarDeleted = (deletedCarId) => {
      setCars((prevCars) => prevCars.filter((car) => car._id !== deletedCarId));
    };

    socket.on("new-car", handleNewCar);
    socket.on("car-deleted", handleCarDeleted);

    return () => {
      socket.off("new-car", handleNewCar);
      socket.off("car-deleted", handleCarDeleted);
      socket.disconnect();
    };
  }, []);

  // Оновлюємо фільтровані авто
  useEffect(() => {
    const applyFilters = () => {
      let filtered = cars;

      if (carName) {
        filtered = filtered.filter((unit) =>
          unit.brand.toLowerCase().includes(carName.toLowerCase())
        );
      }

      if (carModel) {
        filtered = filtered.filter((unit) =>
          unit.name.toLowerCase().includes(carModel.toLowerCase())
        );
      }

      if (year) {
        filtered = filtered.filter((unit) =>
          unit.year.toString().startsWith(year.toString())
        );
      }

      setFilteredCars(filtered);
    };

    applyFilters();
  }, [carName, carModel, year, cars]);

  const handleDeleteCar = async (carId) => {
    const confirmDelete = window.confirm(
      "Ви впевнені, що хочете видалити цей автомобіль?"
    );
    if (!confirmDelete) return;

    try {
      // Видалення автомобіля з улюблених (ігноруємо помилку, якщо його там немає)
      try {
        await axios.delete(`${url}/favorites/${carId}`, setHeaders());
        setFavorites((prevFavorites) =>
          prevFavorites.filter((id) => id !== carId)
        );
      } catch (favErr) {
        if (favErr.response?.status !== 404) {
          console.warn(
            "Помилка видалення з улюблених:",
            favErr.response?.data || favErr.message
          );
        }
      }

      // Видалення самого автомобіля
      await axios.delete(`${url}/cars/${carId}`, setHeaders());

      // Оновлення стану
      setCars((prevCars) => prevCars.filter((car) => car._id !== carId));

      alert("Автомобіль успішно видалено.");
    } catch (err) {
      console.error(
        "Помилка видалення автомобіля:",
        err.response?.data || err.message
      );
      alert("Не вдалося видалити автомобіль. Перевірте з'єднання або дані.");
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <SearchBar
        carName={carName}
        setCarName={setCarName}
        carModel={carModel}
        setCarModel={setCarModel}
        year={year}
        setYear={setYear}
      />
      <div className="cars-container">
        <h1>Класичні автомобілі (до 1987 року)</h1>
        <div className="car-list">
          {filteredCars.length > 0 ? (
            filteredCars.map((unit) => (
              <CarCard
                key={unit._id}
                car={unit}
                isFavorite={favorites.includes(unit._id)}
                isAdmin={isAdmin}
                currentUser={currentUser}
                onDelete={handleDeleteCar}
              />
            ))
          ) : (
            <p className="no-cars-message">
              Класичні автомобілі не знайдено 😔
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ClassicCarList;
