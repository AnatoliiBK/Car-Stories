// src/pages/FilteredCarsPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CarCard from "../components/CarCard";
import { url } from "../slices/api";

const FilteredCarsPage = () => {
  const [cars, setCars] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchFilteredCars = async () => {
      const query = new URLSearchParams(location.search);
      try {
        const response = await axios.get(`${url}/cars/car-filtered-range?${query.toString()}`);
        setCars(response.data.cars);
      } catch (err) {
        console.error("Помилка при завантаженні відфільтрованих авто:", err);
      }
    };

    fetchFilteredCars();
  }, [location.search]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Знайдені автомобілі</h2>
      {cars.length ? (
        <div className="grid gap-4">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      ) : (
        <p>Нічого не знайдено 😔</p>
      )}
    </div>
  );
};

export default FilteredCarsPage;
