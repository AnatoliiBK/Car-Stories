// import React, { useEffect, useState } from "react";

// const InlineSearchBar = ({ onFiltersChange, foundCount }) => {
//   const [brand, setBrand] = useState("");
//   const [model, setModel] = useState("");
//   const [yearFrom, setYearFrom] = useState("");
//   const [yearTo, setYearTo] = useState("");

//   // Надсилаємо фільтри наверх при зміні
//   useEffect(() => {
//     onFiltersChange({ brand, model, yearFrom, yearTo });
//   }, [brand, model, yearFrom, yearTo]);

//   return (
//     <div className="inline-search-bar">
//       <input
//         type="text"
//         placeholder="Марка"
//         value={brand}
//         onChange={(e) => setBrand(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Модель"
//         value={model}
//         onChange={(e) => setModel(e.target.value)}
//       />
//       <input
//         type="number"
//         placeholder="Рік від"
//         value={yearFrom}
//         onChange={(e) => setYearFrom(e.target.value)}
//       />
//       <input
//         type="number"
//         placeholder="Рік до"
//         value={yearTo}
//         onChange={(e) => setYearTo(e.target.value)}
//       />
//       {foundCount !== null && (
//         <div className="search-counter">
//           Знайдено авто: <strong>{foundCount}</strong>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InlineSearchBar;
import React, { useState, useEffect } from "react";
import "./InlineSearchBar.css";
import { useTheme } from "../components/ThemeContext";
import CloseIcon from "./icons/CloseIcon"

const InlineSearchBar = ({ onFilterChange, count }) => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const { theme } = useTheme();

  // Відстеження змін фільтрів
  useEffect(() => {
    onFilterChange({ brand, model, yearFrom, yearTo });
  }, [brand, model, yearFrom, yearTo]);

  const clearFilters = () => {
    setBrand("");
    setModel("");
    setYearFrom("");
    setYearTo("");
  };

  // Перевірка, чи всі фільтри порожні
  const filtersEmpty = !brand && !model && !yearFrom && !yearTo;

  return (
    <div className={`inline-search-bar ${theme}`}>
      <input
        type="text"
        placeholder="Марка"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className={`search-input ${theme}`}
      />
      <input
        type="text"
        placeholder="Модель"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className={`search-input ${theme}`}
      />
      <input
        type="number"
        placeholder="Рік від"
        value={yearFrom}
        onChange={(e) => setYearFrom(e.target.value)}
        className={`search-input ${theme}`}
      />
      <input
        type="number"
        placeholder="Рік до"
        value={yearTo}
        onChange={(e) => setYearTo(e.target.value)}
        className={`search-input ${theme}`}
      />

      {!filtersEmpty && count > 0 &&(
        // <>
        //   <span className="result-counter">
        //     Знайдено: {count}
        //   </span>
        //   <button className="clear-btn" onClick={clearFilters} title="Очистити фільтри">
        //     ❌
        //   </button>
        // </>
        <>
  <span className={`result-counter ${!filtersEmpty && count > 0 ? "result-counter-visible" : ""}`}>
    Знайдено: {count}
  </span>

  <div
    className={`clear-icon-wrapper ${!filtersEmpty ? "visible" : ""}`}
    onClick={clearFilters}
    title="Очистити фільтри"
  >
    <CloseIcon className="animated-close-icon" />
  </div>
</>
      )}
    </div>
  );
};

export default InlineSearchBar;
