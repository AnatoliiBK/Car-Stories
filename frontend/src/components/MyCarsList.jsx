import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./CarList.css";
import CarCard from "./CarCard";
import { url, setHeaders } from "../slices/api";

const MyCarsList = () => {
  const [cars, setCars] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCarsAndFavorites = async () => {
      try {
        const [carResponse, favoriteResponse, userResponse] = await Promise.all([
          axios.get(`${url}/cars`),
          axios.get(`${url}/favorites`, setHeaders()),
          axios.get(`${url}/users/me`, setHeaders()),
        ]);

        const user = userResponse.data;
        setCurrentUser(user);
        console.log("USER : ", user)
        console.log("CAR RESPONSE : ", carResponse.data)

        // Фільтруємо тільки ті автомобілі, які належать поточному користувачеві
        const userCars = carResponse.data.filter(car => car.createdBy._id === user._id);
        setCars(userCars);
        console.log("USER CARS : ", userCars)

        setFavorites(favoriteResponse.data.map((fav) => fav.car?._id));
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
      if (newCar.owner === currentUser?._id) {
        setCars((prevCars) => [...prevCars, newCar]);
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
  }, [currentUser?._id]);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="cars-container">
      <h1>Мої автомобілі</h1>
      <div className="car-list">
        {cars.length > 0 ? (
          cars.map((unit) => (
            <CarCard
              key={unit._id}
              car={unit}
              isFavorite={favorites.includes(unit._id)}
              currentUser={currentUser}
            />
          ))
        ) : (
          <p className="no-cars-message">Ви ще не додали жодного автомобіля 😔</p>
        )}
      </div>
    </div>
  );
};

export default MyCarsList;
