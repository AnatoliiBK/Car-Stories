import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CarCard from "./CarCard";
import { io } from "socket.io-client";
import { fetchViewedCars, removeViewedCar } from "../slices/viewedCarsSlice"; // ✅ Додано Redux action
import "./CarList.css";
import { url } from "../slices/api";
import { useTheme } from "../components/ThemeContext";
import SearchBar from "./SearchBar";
// import { FaTrash } from "react-icons/fa"; // Іконка "смітника"
// import { FaTimes } from "react-icons/fa"; // Іконка "Х"

const socket = io(url);

const ViewedCars = () => {
  const dispatch = useDispatch();
  const viewedCars = useSelector((state) => state.viewedCars.viewedCars); // ✅ Отримуємо з Redux назва зрізу viewedCars і назва масиву viewedCars
  // console.log("VIEWED CARS :", viewedCars);
  const { theme } = useTheme();
  // const [currentUser, setCurrentUser] = useState(null);
  const currentUser = useSelector((state) => state.auth);
  console.log("CURRENT USER : ", currentUser)

  const [selectedCars, setSelectedCars] = useState([]);

  const [filteredViewed, setFilteredViewed] = useState([]);
  const [carName, setCarName] = useState("");
  const [carModel, setCarModel] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    dispatch(fetchViewedCars()); // 🔹 Отримуємо переглянуті авто з сервера

    // 🔹 Підписуємося на WebSocket події
    socket.on("viewed-updated", () => {
      dispatch(fetchViewedCars()); // 🔹 Оновлюємо дані в Redux
    });

    return () => {
      socket.off("viewed-updated");
      socket.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
   
    let filtered = [...viewedCars];

    if (carName) {
      filtered = filtered.filter((unit) =>
        unit.carId.brand.toLowerCase().includes(carName.toLowerCase())
      );
    }

    if (carModel) {
      filtered = filtered.filter((fav) =>
        fav.carId.name.toLowerCase().includes(carModel.toLowerCase())
      );
    }

    if (year) {
      filtered = filtered.filter((unit) =>
        unit.carId.year.toString().startsWith(year.toString())
      );
    }

    setFilteredViewed(filtered);
  }, [carName, carModel, year, viewedCars]);

  //  const handleRemoveViewedCar = async (carId) => {
  //   await dispatch(removeViewedCar(carId)); // 🔹 Видаляємо авто
  // };
//   const handleRemoveViewedCar = (carId) => {
//   const confirmDelete = window.confirm("Ви впевнені, що хочете видалити цей автомобіль з переглянутих?");
//   if (confirmDelete) {
//     dispatch(removeViewedCar(carId));
//   }
  // };
  
  // Функція для перемикання вибору автомобіля
  const toggleSelectCar = (carId) => {
    setSelectedCars((prevSelected) =>
      prevSelected.includes(carId)
        ? prevSelected.filter((id) => id !== carId)
        : [...prevSelected, carId]
    );
  };

  // Функція для вибору всіх автомобілів
  const selectAllCars = () => {
    if (selectedCars.length === filteredViewed.length) {
      setSelectedCars([]); // Якщо всі вибрані — знімаємо вибір
    } else {
      setSelectedCars(filteredViewed.map((unit) => unit.carId._id));
    }
  };

  // Функція для видалення вибраних автомобілів
  const handleRemoveSelectedCars = () => {
    const confirmDelete = window.confirm(
      "Ви впевнені, що хочете видалити вибрані автомобілі?"
    );
    if (confirmDelete) {
      selectedCars.forEach((carId) => dispatch(removeViewedCar(carId)));
      setSelectedCars([]); // Очистити вибір після видалення
    }
  };

  const handleFilterChange = (newFilterValue, filterType) => {
  if (filterType === "brand") setCarName(newFilterValue);
  if (filterType === "model") setCarModel(newFilterValue);
  if (filterType === "year") setYear(newFilterValue);

  // setPage(1);  // ОНОВЛЮЄМО СТОРІНКУ НА ПЕРШУ ПРИ ЗМІНІ ФІЛЬТРА
};


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
      <h1>Переглянуті автомобілі</h1>

      {filteredViewed.length > 0 && selectedCars.length > 0 && (
        <div className={`selection-controls ${theme}`}>
          <button onClick={selectAllCars} className="select-all-button">
            {selectedCars.length === filteredViewed.length ? "Зняти вибір" : "Вибрати всі"}
          </button>
          <button onClick={handleRemoveSelectedCars} className="delete-selected-button">
            Видалити вибрані ({selectedCars.length})
          </button>
        </div>
      )}
      <div className="car-list">
        {/* {viewedCars.length > 0 ? (
          viewedCars.map((unit) => <CarCard key={unit.carId._id} car={unit.carId} />)
        ) : (
          <p className="no-cars-message">Ви ще не переглядали автомобілі.</p>
        )} */}
        {filteredViewed.length > 0 ? (
          filteredViewed.map((unit) => (
            <div key={unit.carId._id} className="car-card-container">
              <input
                type="checkbox"
                checked={selectedCars.includes(unit.carId._id)}
                onChange={() => toggleSelectCar(unit.carId._id)}
                className="car-checkbox"
              />
              <CarCard key={unit.carId._id} car={unit.carId} currentUser={currentUser}/>
              {/* <button
                className="remove-viewed-button"
                onClick={() => handleRemoveViewedCar(unit.carId._id)}
              >
                <FaTimes className="close-icon" />
                <span className="delete-text">Вилучити</span>
              </button> */}
            </div>
          ))
        ) : (
          <p className="no-cars-message">Ви ще не переглядали автомобілі.</p>
        )}
      </div>
    </div>
    </>
    
  );
};

export default ViewedCars;

// import React, { useEffect, useState } from "react";
// import CarCard from "./CarCard";
// import { io } from "socket.io-client";
// import "./CarList.css"; // Використовуємо той самий стиль, що й для CarList
// import { url } from "../slices/api";

// const socket = io(url); // Заміни на свій бекенд

// const ViewedCars = () => {
//   const [viewedCars, setViewedCars] = useState([]);

//   // useEffect(() => {
//   //   // Завантаження переглянутих авто з локального сховища
//   //   const storedViewedCars = JSON.parse(localStorage.getItem("viewedCars")) || [];
//   //   setViewedCars(storedViewedCars);

//   //   // Отримуємо оновлення через WebSocket
//   //   socket.on("viewed-car", () => {
//   //     const updatedViewedCars = JSON.parse(localStorage.getItem("viewedCars")) || [];
//   //     setViewedCars(updatedViewedCars);
//   //   });

//   //   return () => {
//   //     socket.off("viewed-car");
//   //     socket.disconnect();
//   //   };
//   // }, []);

//   // ViewedCars буде оновлюватися не тільки через WebSocket, а й коли localStorage
//   // зміниться.
//   useEffect(() => {
//   const updateViewedCars = () => {
//     const storedViewedCars = JSON.parse(localStorage.getItem("viewedCars")) || [];
//     setViewedCars(storedViewedCars);
//   };

//   updateViewedCars(); // Завантажуємо при старті

//   // Підписка на WebSocket
//   socket.on("viewed-car", updateViewedCars);

//   // 📢 Додаємо слухача `localStorage`
//   window.addEventListener("storage", updateViewedCars);

//   return () => {
//     socket.off("viewed-car", updateViewedCars);
//     window.removeEventListener("storage", updateViewedCars);
//     socket.disconnect();
//   };
// }, []);

//   return (
//     <div className="cars-container">
//       <h1>Переглянуті автомобілі</h1>
//       <div className="car-list">
//         {viewedCars.length > 0 ? (
//           viewedCars.map((car) => <CarCard key={car._id} car={car} />)
//         ) : (
//           <p className="no-cars-message">Ви ще не переглядали автомобілі.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewedCars;

// import React, { useEffect, useState } from "react";
// import CarCard from "./CarCard";
// import "./CarList.css"; // Використовуємо той самий стиль, що й для CarList

// const ViewedCars = () => {
//   const [viewedCars, setViewedCars] = useState([]);

//   useEffect(() => {
//     const storedViewedCars = JSON.parse(localStorage.getItem("viewedCars")) || [];
//     setViewedCars(storedViewedCars);
//   }, []);

//   return (
//     <div className="cars-container">
//       <h1>Переглянуті автомобілі</h1>
//       <div className="car-list">
//         {viewedCars.length > 0 ? (
//           viewedCars.map((car) => <CarCard key={car._id} car={car} />)
//         ) : (
//           <p className="no-cars-message">Ви ще не переглядали автомобілі.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewedCars;
