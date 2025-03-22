import React from "react";
import "./SearchBar.css";
import { useTheme } from "../components/ThemeContext";

const SearchBar = ({ carName, setCarName, carModel, setCarModel, year, setYear }) => {
    const { theme } = useTheme();
    const handleYearChange = (e) => {
    const inputYear = e.target.value;
    if (inputYear === "" || /^[0-9]*$/.test(inputYear)) {
      setYear(inputYear); // Оновлюємо стан лише для цифр або порожнього значення
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={carName}
        onChange={(e) => setCarName(e.target.value)}
        placeholder="Введіть назву"
        className={`search-input ${theme}`}
        // className="search-input"
      />
      <input
        type="text"
        value={carModel}
        onChange={(e) => setCarModel(e.target.value)}
        placeholder="Введіть модель"
        className={`search-input ${theme}`}
        // className="search-input"
      />
      <input
        type="number"
        value={year}
        onChange={handleYearChange}
        placeholder="Введіть рік"
        className={`search-input ${theme}`}
        // className="search-input"
      />
    </div>
  );
};

export default SearchBar;
