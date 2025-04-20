// import React, { useState, useEffect } from "react";
// import "./InlineSearchBar.css";
// import { useTheme } from "../components/ThemeContext";
// import CloseIcon from "./icons/CloseIcon";

// const InlineSearchBar = ({ onFilterChange, count }) => {
//   const [brand, setBrand] = useState("");
//   const [model, setModel] = useState("");
//   const [yearFrom, setYearFrom] = useState("");
//   const [yearTo, setYearTo] = useState("");
//   const { theme } = useTheme();

//   // Відстеження змін фільтрів
//   useEffect(() => {
//     onFilterChange({ brand, model, yearFrom, yearTo });
//   }, [brand, model, yearFrom, yearTo]);

//   const clearFilters = () => {
//     setBrand("");
//     setModel("");
//     setYearFrom("");
//     setYearTo("");
//   };

//   // Перевірка, чи всі фільтри порожні
//   const filtersEmpty = !brand && !model && !yearFrom && !yearTo;

//   return (
//     <div className={`inline-search-bar ${theme}`}>
//       <input
//         type="text"
//         placeholder="Марка"
//         value={brand}
//         onChange={(e) => setBrand(e.target.value)}
//         className={`search-input ${theme}`}
//       />
//       <input
//         type="text"
//         placeholder="Модель"
//         value={model}
//         onChange={(e) => setModel(e.target.value)}
//         className={`search-input ${theme}`}
//       />
//       <input
//         type="number"
//         placeholder="Рік від"
//         value={yearFrom}
//         onChange={(e) => setYearFrom(e.target.value)}
//         className={`search-input ${theme}`}
//       />
//       <input
//         type="number"
//         placeholder="Рік до"
//         value={yearTo}
//         onChange={(e) => setYearTo(e.target.value)}
//         className={`search-input ${theme}`}
//       />

//       {!filtersEmpty && count > 0 && (
//         <>
//           <span
//             className={`result-counter ${
//               !filtersEmpty && count > 0 ? "result-counter-visible" : ""
//             }`}
//           >
//             Знайдено: {count}
//           </span>

//           <div
//             className={`clear-icon-wrapper ${!filtersEmpty ? "visible" : ""}`}
//             onClick={clearFilters}
//             title="Очистити фільтри"
//           >
//             <CloseIcon className="animated-close-icon" />
//             <span className="clear-text">Очистити все</span>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default InlineSearchBar;

import React, { useState, useEffect, forwardRef } from "react";
import "./InlineSearchBar.css";
import { useTheme } from "../components/ThemeContext";
import CloseIcon from "./icons/CloseIcon";

const InlineSearchBar = forwardRef(
  (
    {
      onFilterChange,
      count,
      brand: initialBrand,
      model: initialModel,
      yearFrom: initialYearFrom,
      yearTo: initialYearTo,
    },
    ref
  ) => {
    // const [brand, setBrand] = useState("");
    // const [model, setModel] = useState("");
    // const [yearFrom, setYearFrom] = useState("");
    // const [yearTo, setYearTo] = useState("");
    const [brand, setBrand] = useState(initialBrand || "");
    const [model, setModel] = useState(initialModel || "");
    const [yearFrom, setYearFrom] = useState(initialYearFrom || "");
    const [yearTo, setYearTo] = useState(initialYearTo || "");
    const { theme } = useTheme();

    useEffect(() => {
      onFilterChange({ brand, model, yearFrom, yearTo });
    }, [brand, model, yearFrom, yearTo]);

    const clearFilters = () => {
      setBrand("");
      setModel("");
      setYearFrom("");
      setYearTo("");
    };

    const filtersEmpty = !brand && !model && !yearFrom && !yearTo;

    return (
      <div ref={ref} className={`inline-search-bar ${theme}`}>
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

        {!filtersEmpty && count > 0 && (
          <>
            <span
              className={`result-counter ${
                !filtersEmpty && count > 0 ? "result-counter-visible" : ""
              }`}
            >
              Знайдено: <span className="count-int">{count}</span>
            </span>

            <div
              className={`clear-icon-wrapper ${!filtersEmpty ? "visible" : ""}`}
              onClick={clearFilters}
              title="Очистити фільтри"
            >
              <CloseIcon className="animated-close-icon" />
              <span className="clear-text">Очистити все</span>
            </div>
          </>
        )}
      </div>
    );
  }
);

export default InlineSearchBar;

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
