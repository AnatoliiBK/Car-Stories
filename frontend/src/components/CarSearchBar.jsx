import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchBar.css";
import CarCard from "./CarCard";
import { useTheme } from "../components/ThemeContext";
import { url } from "../slices/api";

const CarSearchBar = () => {
  const { theme } = useTheme();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const areFiltersApplied = () => brand || model || yearFrom || yearTo;

  const handleSearch = async () => {
    if (!areFiltersApplied()) {
      setFilteredCars([]);
      setShowResults(false);
      return;
    }

    try {
      const params = new URLSearchParams();
      if (brand) params.append("brand", brand);
      if (model) params.append("model", model);
      if (yearFrom) params.append("yearFrom", yearFrom);
      if (yearTo) params.append("yearTo", yearTo);

      const response = await axios.get(`${url}/cars/car-filtered-range?${params.toString()}`);
      setFilteredCars(response.data.cars);
      setShowResults(false);
    } catch (err) {
      console.error("Помилка при фільтрації:", err);
    }
  };

  const handleClear = () => {
    setBrand("");
    setModel("");
    setYearFrom("");
    setYearTo("");
    setFilteredCars([]);
    setShowResults(false);
  };

  useEffect(() => {
    handleSearch();
  }, [brand, model, yearFrom, yearTo]);

  return (
    <div>
      <div className="search-bar">
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
        {areFiltersApplied() && (
          <button
            onClick={handleClear}
            className={`clear-button ${theme}`}
          >
            Очистити фільтри
          </button>
        )}
      </div>

      {areFiltersApplied() && filteredCars.length > 0 && !showResults && (
        <div
          className={`results-counter ${theme}`}
          onClick={() => setShowResults(true)}
        >
          Знайдено авто: {filteredCars.length} 🚗 (натисни, щоб переглянути)
        </div>
      )}

      <div className={`car-list ${showResults ? "show" : "hidden"}`}>
        {showResults && filteredCars.length > 0 ? (
          filteredCars.map((car) => <CarCard key={car._id} car={car} />)
        ) : (
          areFiltersApplied() && showResults && (
            <p className="no-cars-message">Нічого не знайдено 😔</p>
          )
        )}
      </div>
    </div>
  );
};

export default CarSearchBar;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./SearchBar.css";
// import CarCard from "./CarCard";
// import { useTheme } from "../components/ThemeContext";
// import { url } from "../slices/api";

// const CarSearchBar = () => {
//   const { theme } = useTheme();
//   const [brand, setBrand] = useState("");
//   const [model, setModel] = useState("");
//   const [yearFrom, setYearFrom] = useState("");
//   const [yearTo, setYearTo] = useState("");
//   const [filteredCars, setFilteredCars] = useState([]);

//   // Функція для перевірки, чи є введені фільтри
//   const areFiltersApplied = () => {
//     return brand || model || yearFrom || yearTo;
//   };

//   // Функція для пошуку автомобілів
//   const handleSearch = async () => {
//     if (!areFiltersApplied()) {
//       setFilteredCars([]); // Якщо фільтри не заповнені, не робимо запит і очищаємо список
//       return;
//     }

//     try {
//       const params = new URLSearchParams();
//       if (brand) params.append("brand", brand);
//       if (model) params.append("model", model);
//       if (yearFrom) params.append("yearFrom", yearFrom);
//       if (yearTo) params.append("yearTo", yearTo);

//       const response = await axios.get(`${url}/cars/car-filtered-range?${params.toString()}`);
//       setFilteredCars(response.data.cars);
//     } catch (err) {
//       console.error("Помилка при фільтрації:", err);
//     }
//   };

//   // Викликаємо пошук, коли змінюються фільтри
//   useEffect(() => {
//     handleSearch(); // автоматичний запит при кожній зміні фільтрів
//   }, [brand, model, yearFrom, yearTo]);

//   return (
//     <div>
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Марка"
//           value={brand}
//           onChange={(e) => setBrand(e.target.value)}
//           className={`search-input ${theme}`}
//         />
//         <input
//           type="text"
//           placeholder="Модель"
//           value={model}
//           onChange={(e) => setModel(e.target.value)}
//           className={`search-input ${theme}`}
//         />
//         <input
//           type="number"
//           placeholder="Рік від"
//           value={yearFrom}
//           onChange={(e) => setYearFrom(e.target.value)}
//           className={`search-input ${theme}`}
//         />
//         <input
//           type="number"
//           placeholder="Рік до"
//           value={yearTo}
//           onChange={(e) => setYearTo(e.target.value)}
//           className={`search-input ${theme}`}
//         />
//       </div>

//       <div className="car-list">
//         {filteredCars.length > 0 ? (
//           filteredCars.map((car) => <CarCard key={car._id} car={car} />)
//         ) : (
//           // Показуємо повідомлення, якщо немає автомобілів
//           areFiltersApplied() ? (
//             <p className="no-cars-message">Нічого не знайдено 😔</p>
//           ) : (
//             <p className="no-cars-message">Введіть дані для пошуку автомобілів</p>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default CarSearchBar;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./SearchBar.css";
// import CarCard from "./CarCard";
// import { useTheme } from "../components/ThemeContext";
// import { url } from "../slices/api";

// const CarSearchBar = () => {
//   const { theme } = useTheme();
//   const [brand, setBrand] = useState("");
//   const [model, setModel] = useState("");
//   const [yearFrom, setYearFrom] = useState("");
//   const [yearTo, setYearTo] = useState("");
//   const [filteredCars, setFilteredCars] = useState([]);

//   const handleSearch = async () => {
//     try {
//       const params = new URLSearchParams();
//       if (brand) params.append("brand", brand);
//       if (model) params.append("model", model);
//       if (yearFrom) params.append("yearFrom", yearFrom);
//       if (yearTo) params.append("yearTo", yearTo);

//       const response = await axios.get(`${url}/cars/car-filtered-range?${params.toString()}`);
//       setFilteredCars(response.data.cars);
//     } catch (err) {
//       console.error("Помилка при фільтрації:", err);
//     }
//   };

//   useEffect(() => {
//     handleSearch(); // автоматичний запит при кожній зміні
//   }, [brand, model, yearFrom, yearTo]);

//   return (
//     <div>
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Марка"
//           value={brand}
//           onChange={(e) => setBrand(e.target.value)}
//           className={`search-input ${theme}`}
//         />
//         <input
//           type="text"
//           placeholder="Модель"
//           value={model}
//           onChange={(e) => setModel(e.target.value)}
//           className={`search-input ${theme}`}
//         />
//         <input
//           type="number"
//           placeholder="Рік від"
//           value={yearFrom}
//           onChange={(e) => setYearFrom(e.target.value)}
//           className={`search-input ${theme}`}
//         />
//         <input
//           type="number"
//           placeholder="Рік до"
//           value={yearTo}
//           onChange={(e) => setYearTo(e.target.value)}
//           className={`search-input ${theme}`}
//         />
//       </div>

//       <div className="car-list">
//         {filteredCars.length > 0 ? (
//           filteredCars.map((car) => <CarCard key={car._id} car={car} />)
//         ) : (
//           <p className="no-cars-message">Нічого не знайдено 😔</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CarSearchBar;
