import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../slices/api";
import "./AddCarSpecs.css"
import { useTheme } from "../components/ThemeContext";

const AddCarSpecs = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [fuelType, setFuelType] = useState("бензин");
  const [specs, setSpecs] = useState({});
  const { theme } = useTheme();

  const handleChange = (e) => {
    setSpecs({ ...specs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/car-specs`, { carId, fuelType, ...specs });
      navigate(`/cars/${carId}`); // Повертаємо користувача до авто
    } catch (error) {
      console.error("Помилка додавання характеристик:", error);
    }
  };

  return (
    <div className="add-specs-container">
      <h2>Додати характеристики авто</h2>
      <form className={`specs-form ${theme}`} onSubmit={handleSubmit}>
        <label>Тип двигуна:</label>
        <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
          <option value="бензин">Бензин</option>
          <option value="дизель">Дизель</option>
          <option value="гібрид">Гібрид</option>
          <option value="електро">Електро</option>
        </select>

        {fuelType === "бензин" || fuelType === "дизель" ? (
          <>
            <label>Об'єм двигуна (л):</label>
            <input type="number" name="engineDisplacement"  step="0.01" onChange={handleChange} />

            <label>Потужність (к.с.):</label>
            <input type="number" name="horsepower" onChange={handleChange} />

            <label>Крутний момент (Нм):</label>
            <input type="number" name="torque" onChange={handleChange} />

            <label>Витрата пального (л/100 км):</label>
            <input type="number" name="fuelConsumption" onChange={handleChange} />

            <label>Коробка передач:</label>
            <input type="text" name="transmission" onChange={handleChange} />
          </>
        ) : fuelType === "гібрид" ? (
          <>
            <label>Тип гібрида:</label>
            <input type="text" name="hybridType" onChange={handleChange} />

            <label>Об'єм двигуна (л):</label>
            <input type="number" name="engineDisplacement" onChange={handleChange} />

            <label>Потужність електромотора (кВт):</label>
            <input type="number" name="electricMotorPower" onChange={handleChange} />

            <label>Загальна потужність (к.с.):</label>
            <input type="number" name="totalHorsepower" onChange={handleChange} />

            <label>Запас ходу на електро (км):</label>
            <input type="number" name="electricRange" onChange={handleChange} />
          </>
        ) : (
          <>
            <label>Ємність батареї (кВт⋅год):</label>
            <input type="number" name="batteryCapacity" onChange={handleChange} />

            <label>Запас ходу (км):</label>
            <input type="number" name="range" onChange={handleChange} />

            <label>Потужність електромотора (кВт):</label>
            <input type="number" name="electricMotorPower" onChange={handleChange} />

            <label>Час зарядки:</label>
            <input type="text" name="chargeTime" onChange={handleChange} />

            <label>Тип зарядного роз'єму:</label>
            <input type="text" name="chargePort" onChange={handleChange} />
          </>
        )}

        <button className="add-specs-button" type="submit">Зберегти</button>
      </form>
    </div>
  );
};

export default AddCarSpecs;
