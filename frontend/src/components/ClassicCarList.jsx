import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./CarList.css";
import CarCard from "./CarCard";
import InlineSearchBar from "./InlineSearchBar";
import Triangle from "./Triangle";
import PageNavigation from "./PageNavigation";
import { url, setHeaders } from "../slices/api";
import { useTheme } from "../components/ThemeContext";

const ClassicCarList = () => {
  const [cars, setCars] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { theme } = useTheme();

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredCount, setFilteredCount] = useState(0);

  // Search bar states
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const wrapperRef = useRef(null);
  const searchBarRef = useRef(null);

  // Filters
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    yearFrom: "",
    yearTo: "", // Remove default 1986, rely on server-side classic filter
  });

  const areFiltersApplied =
    filters.brand || filters.model || filters.yearFrom || filters.yearTo;

  const fetchCarsAndFavorites = async () => {
    try {
      const queryParams = new URLSearchParams({
        brand: filters.brand,
        model: filters.model,
        yearFrom: filters.yearFrom,
        yearTo: filters.yearTo,
        page,
        limit,
        classic: true, // Ensure classic filter is applied
      });

      const [carResponse, favoriteResponse, userResponse] = await Promise.all([
        axios.get(`${url}/cars/car-filtered-classic?${queryParams.toString()}`),
        axios.get(`${url}/favorites`, setHeaders()),
        axios.get(`${url}/users/me`, setHeaders()),
      ]);

      setCars(carResponse.data.cars);
      setFilteredCount(carResponse.data.totalFiltered);
      setTotalPages(carResponse.data.totalPages);
      setFavorites(favoriteResponse.data.map((fav) => fav.car?._id));
      setIsAdmin(userResponse.data.isAdmin);
      setCurrentUser(userResponse.data);
      setLoading(false);
    } catch (err) {
      console.error("Помилка завантаження:", err);
      setError(
        "Не вдалося завантажити список автомобілів. Потрібна авторизація."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarsAndFavorites();
  }, [filters, page]);

  // Search bar animation
  useEffect(() => {
    if (searchBarRef.current) {
      if (isSearchBarOpen) {
        searchBarRef.current.classList.add("open");
        searchBarRef.current.classList.remove("closed");
      } else {
        searchBarRef.current.classList.add("closed");
        searchBarRef.current.classList.remove("open");
      }
    }
  }, [isSearchBarOpen]);

  // WebSocket for real-time updates
  useEffect(() => {
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

  // Close search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsSearchBarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleDeleteCar = async (carId) => {
    const confirmDelete = window.confirm(
      "Ви впевнені, що хочете видалити цей автомобіль?"
    );
    if (!confirmDelete) return;

    try {
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

      await axios.delete(`${url}/cars/${carId}`, setHeaders());
      setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
      alert("Автомобіль успішно видалено.");
    } catch (err) {
      console.error(
        "Помилка видалення автомобіля:",
        err.response?.data || err.message
      );
      alert("Не вдалося видалити автомобіль.");
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div ref={wrapperRef} className="inline-search-wrapper">
        <Triangle
          isOpen={isSearchBarOpen}
          onToggle={() => setIsSearchBarOpen((prev) => !prev)}
        />
        {!isSearchBarOpen && areFiltersApplied && (
          <div className={`filter-summary ${theme}`}>
            <span className="counter-value">({filteredCount})</span>, згідно
            заповнених даних
          </div>
        )}
        <InlineSearchBar
          ref={searchBarRef}
          onFilterChange={handleFilterChange}
          count={filteredCount}
          brand={filters.brand}
          model={filters.model}
          yearFrom={filters.yearFrom}
          yearTo={filters.yearTo}
        />
      </div>
      <div className="cars-container">
        <h1>Класичні автомобілі (до 1987 року)</h1>
        <div className="car-list">
          {cars.length > 0 ? (
            cars.map((unit) => (
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
        {cars.length > 0 && totalPages > 1 && (
          <PageNavigation
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        )}
      </div>
    </>
  );
};

export default ClassicCarList;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import io from "socket.io-client";
// import "./CarList.css";
// import CarCard from "./CarCard";
// import SearchBar from "./SearchBar";
// import { url, setHeaders } from "../slices/api";

// const ClassicCarList = () => {
//   const [cars, setCars] = useState([]);
//   const [filteredCars, setFilteredCars] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [carName, setCarName] = useState(""); // Для пошуку за назвою
//   const [carModel, setCarModel] = useState("");
//   const [year, setYear] = useState(""); // Для пошуку за роком
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     const fetchCarsAndFavorites = async () => {
//       try {
//         const [carResponse, favoriteResponse, userResponse] = await Promise.all(
//           [
//             axios.get(`${url}/cars`),
//             axios.get(`${url}/favorites`, setHeaders()),
//             axios.get(`${url}/users/me`, setHeaders()), // Перевіряємо роль
//           ]
//         );

//         const classicCars = carResponse.data.filter((car) => car.year < 1987);
//         setCars(classicCars);
//         setFavorites(favoriteResponse.data.map((fav) => fav.car?._id)); // ID улюблених
//         setIsAdmin(userResponse.data.isAdmin); // Роль користувача
//         setCurrentUser(userResponse.data); // Зберігаємо поточного користувача
//         setLoading(false);
//       } catch (err) {
//         console.error("Помилка завантаження даних:", err);
//         setError("Не вдалося завантажити список автомобілів.");
//         setLoading(false);
//       }
//     };

//     fetchCarsAndFavorites();

//     // Підключення до WebSocket
//     const socket = io(url);

//     const handleNewCar = (newCar) => {
//       if (newCar.year < 1987) {
//         setCars((prevCars) => {
//           if (prevCars.some((car) => car._id === newCar._id)) return prevCars;
//           return [newCar, ...prevCars];
//         });
//       }
//     };

//     const handleCarDeleted = (deletedCarId) => {
//       setCars((prevCars) => prevCars.filter((car) => car._id !== deletedCarId));
//     };

//     socket.on("new-car", handleNewCar);
//     socket.on("car-deleted", handleCarDeleted);

//     return () => {
//       socket.off("new-car", handleNewCar);
//       socket.off("car-deleted", handleCarDeleted);
//       socket.disconnect();
//     };
//   }, []);

//   // Оновлюємо фільтровані авто
//   useEffect(() => {
//     const applyFilters = () => {
//       let filtered = cars;

//       if (carName) {
//         filtered = filtered.filter((unit) =>
//           unit.brand.toLowerCase().includes(carName.toLowerCase())
//         );
//       }

//       if (carModel) {
//         filtered = filtered.filter((unit) =>
//           unit.name.toLowerCase().includes(carModel.toLowerCase())
//         );
//       }

//       if (year) {
//         filtered = filtered.filter((unit) =>
//           unit.year.toString().startsWith(year.toString())
//         );
//       }

//       setFilteredCars(filtered);
//     };

//     applyFilters();
//   }, [carName, carModel, year, cars]);

//   const handleDeleteCar = async (carId) => {
//     const confirmDelete = window.confirm(
//       "Ви впевнені, що хочете видалити цей автомобіль?"
//     );
//     if (!confirmDelete) return;

//     try {
//       // Видалення автомобіля з улюблених (ігноруємо помилку, якщо його там немає)
//       try {
//         await axios.delete(`${url}/favorites/${carId}`, setHeaders());
//         setFavorites((prevFavorites) =>
//           prevFavorites.filter((id) => id !== carId)
//         );
//       } catch (favErr) {
//         if (favErr.response?.status !== 404) {
//           console.warn(
//             "Помилка видалення з улюблених:",
//             favErr.response?.data || favErr.message
//           );
//         }
//       }

//       // Видалення самого автомобіля
//       await axios.delete(`${url}/cars/${carId}`, setHeaders());

//       // Оновлення стану
//       setCars((prevCars) => prevCars.filter((car) => car._id !== carId));

//       alert("Автомобіль успішно видалено.");
//     } catch (err) {
//       console.error(
//         "Помилка видалення автомобіля:",
//         err.response?.data || err.message
//       );
//       alert("Не вдалося видалити автомобіль. Перевірте з'єднання або дані.");
//     }
//   };

//   const handleFilterChange = (newFilterValue, filterType) => {
//   if (filterType === "brand") setCarName(newFilterValue);
//   if (filterType === "model") setCarModel(newFilterValue);
//   if (filterType === "year") setYear(newFilterValue);

//   // setPage(1);  // ОНОВЛЮЄМО СТОРІНКУ НА ПЕРШУ ПРИ ЗМІНІ ФІЛЬТРА
// };

//   if (loading) return <p>Завантаження...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <>
//       <SearchBar
//         carName={carName}
//         setCarName={setCarName}
//         carModel={carModel}
//         setCarModel={setCarModel}
//         year={year}
//         setYear={setYear}
//         handleFilterChange={handleFilterChange}
//       />
//       <div className="cars-container">
//         <h1>Класичні автомобілі (до 1987 року)</h1>
//         <div className="car-list">
//           {filteredCars.length > 0 ? (
//             filteredCars.map((unit) => (
//               <CarCard
//                 key={unit._id}
//                 car={unit}
//                 isFavorite={favorites.includes(unit._id)}
//                 isAdmin={isAdmin}
//                 currentUser={currentUser}
//                 onDelete={handleDeleteCar}
//               />
//             ))
//           ) : (
//             <p className="no-cars-message">
//               Класичні автомобілі не знайдено 😔
//             </p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ClassicCarList;
