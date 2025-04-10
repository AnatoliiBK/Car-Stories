import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./CarList.css";
import CarCard from "./CarCard";
import { url, setHeaders } from "../slices/api";
import SearchBar from "./SearchBar";

const MyCarsList = () => {
  const [cars, setCars] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [carName, setCarName] = useState(""); // для пошуку за маркою
  const [carModel, setCarModel] = useState(""); // для пошуку за моделлю
  const [year, setYear] = useState(""); // для пошуку за роком
  const [filteredCars, setFilteredCars] = useState([]);

  useEffect(() => {
    const fetchCarsAndFavorites = async () => {
      try {
        const [carResponse, favoriteResponse, userResponse] = await Promise.all(
          [
            axios.get(`${url}/cars`),
            axios.get(`${url}/favorites`, setHeaders()),
            axios.get(`${url}/users/me`, setHeaders()),
          ]
        );

        const user = userResponse.data;
        setCurrentUser(user);
        console.log("USER : ", user);
        console.log("CAR RESPONSE : ", carResponse.data);

        // Фільтруємо тільки ті автомобілі, які належать поточному користувачеві
        const userCars = carResponse.data.filter(
          (car) => car.createdBy._id === user._id
        );
        setCars(userCars);
        console.log("USER CARS : ", userCars);

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

  const handleFilterChange = (newFilterValue, filterType) => {
    if (filterType === "brand") setCarName(newFilterValue);
    if (filterType === "model") setCarModel(newFilterValue);
    if (filterType === "year") setYear(newFilterValue);

    // setPage(1);  // ОНОВЛЮЄМО СТОРІНКУ НА ПЕРШУ ПРИ ЗМІНІ ФІЛЬТРА
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
        handleFilterChange={handleFilterChange}
      />
      <div className="cars-container">
        <h1>Мої автомобілі</h1>
        <div className="car-list">
          {filteredCars.length > 0 ? (
            filteredCars.map((unit) => (
              <CarCard
                key={unit._id}
                car={unit}
                isFavorite={favorites.includes(unit._id)}
                currentUser={currentUser}
              />
            ))
          ) : (
            <p className="no-cars-message">
              Ви ще не додали жодного автомобіля 😔
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default MyCarsList;
