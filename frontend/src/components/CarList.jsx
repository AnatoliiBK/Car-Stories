import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./CarList.css";
import CarCard from "./CarCard";
import SearchBar from "./SearchBar";
import { url, setHeaders } from "../slices/api";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]); // Відфільтровані авто
  const [favorites, setFavorites] = useState([]);
  const [carName, setCarName] = useState(""); //для пошуку за назвою
  const [carModel, setCarModel] = useState("");
  const [year, setYear] = useState(""); // для пошуку за роком
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // 26 01 25
  const [currentUser, setCurrentUser] = useState(null);

  

  useEffect(() => {
    const fetchCarsAndFavorites = async () => {
      try {
        const [carResponse, favoriteResponse, userResponse] = await Promise.all(
          [
            axios.get(`${url}/cars`),
            axios.get(`${url}/favorites`, setHeaders()),
            axios.get(`${url}/users/me`, setHeaders()), // Перевіряємо роль 26 01 25
          ]
        );

        setCars(carResponse.data);
        setFavorites(favoriteResponse.data.map((fav) => fav.car?._id)); // ID улюблених
        setIsAdmin(userResponse.data.isAdmin); // Роль користувача
        setCurrentUser(userResponse.data); // Зберігаємо поточного користувача
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
      setCars((prevCars) => {
        if (prevCars.some((car) => car._id === newCar._id)) return prevCars;
        return [newCar, ...prevCars];
      });
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

  const handleDeleteCar = async (carId) => {
  const confirmDelete = window.confirm("Ви впевнені, що хочете видалити цей автомобіль?");
  if (!confirmDelete) return;

  try {
    // Видалення автомобіля з улюблених (ігноруємо помилку, якщо його там немає)
    try {
      await axios.delete(`${url}/favorites/${carId}`, setHeaders());
      setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== carId));
    } catch (favErr) {
      if (favErr.response?.status !== 404) {
        console.warn("Помилка видалення з улюблених:", favErr.response?.data || favErr.message);
      }
    }

    // Видалення самого автомобіля
    await axios.delete(`${url}/cars/${carId}`, setHeaders());

    // Оновлення стану
    setCars((prevCars) => prevCars.filter((car) => car._id !== carId));

    alert("Автомобіль успішно видалено.");
  } catch (err) {
    console.error("Помилка видалення автомобіля:", err.response?.data || err.message);
    alert("Не вдалося видалити автомобіль. Перевірте з'єднання або дані.");
  }
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
      />
      <div className="cars-container">
        <h1>Автомобілі</h1>
        <div className="car-list">
          {filteredCars.length > 0 ? (
            filteredCars.map((unit) => (
              <CarCard
                key={unit._id}
                car={unit}
                isFavorite={favorites.includes(unit._id)}
                isAdmin={isAdmin}
                currentUser={currentUser} // Передаємо поточного користувача
                onDelete={handleDeleteCar}
              />
            ))
          ) : (
            <p className="no-cars-message">Автомобілі не знайдено 😔</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CarList;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import io from "socket.io-client";
// import "./CarList.css";
// import CarCard from "./CarCard";
// import SearchBar from "./SearchBar"; // 25 01 25
// import { url, setHeaders } from "../slices/api";

// const CarList = () => {
//   const [cars, setCars] = useState([]);
//   const [filteredCars, setFilteredCars] = useState([]); // 25 01 25
//   const [favorites, setFavorites] = useState([]);
//   const [carName, setcarName] = useState(""); // 25 01 25
//   const [year, setYear] = useState(""); // 25 01 25
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchCarsAndFavorites = async () => {
//       try {
//         const [carResponse, favoriteResponse] = await Promise.all([
//           axios.get(`${url}/cars`),
//           axios.get(`${url}/favorites`, setHeaders()),
//         ]);

//         setCars(carResponse.data);
//         setFilteredCars(carResponse.data); // Спочатку показуємо всі авто // 25 01 25
//         setFavorites(favoriteResponse.data.map((fav) => fav.car._id)); // Отримуємо ID улюблених автомобілів
//         setLoading(false);
//       } catch (err) {
//         console.error("Помилка завантаження даних:", err);
//         setError("Не вдалося завантажити список автомобілів або улюблених.");
//         setLoading(false);
//       }
//     };

//     fetchCarsAndFavorites();

//     // Підключення до WebSocket
//     const socket = io(url);

//     // Обробка події "new-car"
//     const handleNewCar = (newCar) => {
//       setCars((prevCars) => {
//         // Уникаємо дублювання автомобілів
//         if (prevCars.some((car) => car._id === newCar._id)) {
//           return prevCars;
//         }
//         return [newCar, ...prevCars];
//       });
//     };

//     socket.on("new-car", handleNewCar);

//     // Очищення подій та WebSocket підключення
//     return () => {
//       socket.off("new-car", handleNewCar);
//       socket.disconnect();
//     };
//   }, []);

//   // Фільтруємо автомобілі за назвою та роком
//   useEffect(() => {
//     let filtered = cars;

//     if (carName) {
//       filtered = filtered.filter((car) =>
//         car.name.toLowerCase().includes(carName.toLowerCase())
//       );
//     }

//     if (year) {
//       filtered = filtered.filter((car) =>
//         car.year.toString().startsWith(year.toString())
//       );
//     }

//     setFilteredCars(filtered);
//   }, [carName, year, cars]);

//   if (loading) return <p>Завантаження...</p>;
//   if (error) return <p>{error}</p>;

//   // 25 01 25
//   // if (cars.length === 0) {
//   //   return <p className="no-cars-message">Автомобілі не знайдено 😔</p>;
//   // }

//   // 25 01 25 заважало стилізації
//   // if (filteredCars.length === 0) {
//   //   return (
//   //     <div>
//   //       <SearchBar
//   //         carName={carName}
//   //         setcarName={setcarName}
//   //         year={year}
//   //         setYear={setYear}
//   //       />
//   //       <p className="no-cars-message">Автомобілі не знайдено 😔</p>
//   //     </div>
//   //   );
//   // }

//   return (
//     <>
//       <SearchBar
//         carName={carName}
//         setcarName={setcarName}
//         year={year}
//         setYear={setYear}
//       />
//       <div className={`cars-container`}>
//         <h1>Автомобілі</h1>
//         <div className="car-list">
//           {filteredCars.length > 0 ? (
//             filteredCars.map((car) => (
//               <CarCard
//                 key={car._id}
//                 car={car}
//                 isFavorite={favorites.includes(car._id)} // Перевіряємо, чи автомобіль улюблений
//               />
//             ))
//           ) : (
//             <p className="no-cars-message">Автомобілі не знайдено 😔</p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default CarList;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import io from "socket.io-client"; // WebSocket клієнт
// import "./CarList.css";
// import CarCard from "./CarCard"; // Імпорт компоненту CarCard
// import { url, setHeaders } from "../slices/api";

// const CarList = () => {
//   const [cars, setCars] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
// console.log("CARS STATE ", cars)
//   useEffect(() => {
//     const fetchCarsAndFavorites = async () => {
//       try {
//         const carResponse = await axios.get(`${url}/cars`);
//         console.log("carRESPONSE IN LIST", carResponse.data)
//         setCars(carResponse.data);

//         // Запит для отримання списку улюблених автомобілів
//         const favoriteResponse = await axios.get(
//           `${url}/favorites`,
//           setHeaders()
//         );
//         console.log("favoriteResponse IN LIST", favoriteResponse.data)
//         setFavorites(favoriteResponse.data.map((fav) => fav.car._id)); // Отримуємо
//         // тільки ID улюблених автомобілів

//         setLoading(false);
//       } catch (err) {
//         setError("Не вдалося завантажити список автомобілів або улюблених.");

//         setLoading(false);
//       }
//     };

//     fetchCarsAndFavorites();
//     // Підключення до WebSocket
//     const socket = io(url);

//     // Додаємо новий автомобіль до списку при отриманні події
//     socket.on("new-car", (newCar) => {
//       setCars((prevCars) => [newCar, ...prevCars]); // Додаємо новий автомобіль до списку
//     });

//     // Очистка при розмонтуванні компонента
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   if (loading) return <p>Завантаження...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="car-list">
//       {cars.map((car) => (
//         <CarCard
//           key={car._id}
//           car={car}
//           isFavorite={favorites.includes(car._id)}// Перевіряємо, чи автомобіль улюблений
//         />
//       ))}
//     </div>
//   );
// };

// export default CarList;



 // const handleDeleteCar = async (carId) => {
  //   const confirmDelete = window.confirm(
  //   "Ви впевнені, що хочете видалити цей автомобіль?"
  // );

  // if (!confirmDelete) return; // Якщо користувач скасовує, нічого не робимо
  //   try {
  //     // // Видалення автомобіля з колекції `cars`
  //     // await axios.delete(`${url}/cars/${carId}`, setHeaders());

  //     // // Видалення автомобіля з колекції `favorites`
  //     // await axios.delete(`${url}/favorites/car/${carId}`, setHeaders());
  //      // Спочатку видаляємо цей автомобіль з улюблених
  //   await axios.delete(`${url}/favorites/${carId}`, setHeaders());

  //   // Потім видаляємо сам автомобіль з колекції cars
  //   await axios.delete(`${url}/cars/${carId}`, setHeaders());

  //     // Оновлення стану `Cars`
  //     setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
  //     alert("Автомобіль успішно видалено.");

  //   //   // Оновлення стану `Favorites` (якщо доступний setFavorites)
  //   // if (typeof setFavorites === "function") {
  //   //   setFavorites((prevFavorites) =>
  //   //     prevFavorites.filter((fav) => fav.car._id !== carId)
  //   //   );
  //   //   }

  //     alert("Автомобіль успішно видалено.");
  //   } catch (err) {
  //     console.error("Помилка видалення автомобіля:", err);
  //     alert("Не вдалося видалити автомобіль.");
  //   }
  // };