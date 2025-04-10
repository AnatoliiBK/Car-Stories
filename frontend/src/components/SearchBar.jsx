import React from "react";
import "./SearchBar.css";
import { useTheme } from "../components/ThemeContext";

const SearchBar = ({ carName, setCarName, carModel, setCarModel, year, setYear, handleFilterChange }) => {
    const { theme } = useTheme();
  //   const handleYearChange = (e) => {
  //   const inputYear = e.target.value;
  //   if (inputYear === "" || /^[0-9]*$/.test(inputYear)) {
  //     setYear(inputYear); // Оновлюємо стан лише для цифр або порожнього значення
  //   }
  // };
  const handleYearChange = (e) => {
  const inputYear = e.target.value;
  
  // Перевіряємо, щоб було лише число або порожнє значення
  if (inputYear === "" || /^[0-9]*$/.test(inputYear)) {
    setYear(inputYear); 
    handleFilterChange(inputYear, "year");  // Викликаємо handleFilterChange
  }
};


  return (
    <div className="search-bar">
      <input
        type="text"
        value={carName}
        // onChange={(e) => setCarName(e.target.value)}
        onChange={(e) => handleFilterChange(e.target.value, "brand")}
        placeholder="Введіть назву"
        className={`search-input ${theme}`}
        // className="search-input"
      />
      <input
        type="text"
        value={carModel}
        // onChange={(e) => setCarModel(e.target.value)}
        onChange={(e) => handleFilterChange(e.target.value, "model")}
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
