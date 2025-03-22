import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client"; // WebSocket клієнт
import "./RecentlyAddedCars.css";
import { setHeaders, url } from "../slices/api";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import { useSelector } from "react-redux";

// const socket = io(url); // 📢 Перенесено з'єднання сюди, щоб не створювати нове кожного разу

const RecentlyAddedCars = () => {
  const [recentCars, setRecentCars] = useState([]);
  const [favoriteCarIds, setFavoriteCarIds] = useState([]);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const token = useSelector((state) => state.auth.token); // Перевіряємо чи є
  // користувач у системі (отримує токен користувача з Redux). Це найкращий спосіб,
  // оскільки він використовує глобальний стейт і не потребує додаткових подій чи
  // localStorage

  // Очистка улюблених при виході
  useEffect(() => {
    if (!token) {
      setFavoriteCarIds([]);
    }
  }, [token]); // Спрацьовує при зміні token (тобто при виході)

  // Визначення "останніх автомобілів" за датою
  // Функція для відбору авто, створених за останні 20 днів (можна змінити час за потребою)
  const filterRecentCars = (cars) => {
    const now = new Date();
    const timeApproved = new Date();
    timeApproved.setDate(now.getDate() - 60);

    return cars.filter((car) => {
      const createdAt = new Date(car.createdAt);
      return createdAt >= timeApproved;
    });
  };

  // Завантаження автомобілів та улюблених (для індикації)
  const fetchInitialData = async () => {
    try {
      if (!token) return; // Переконуємося, що користувач авторизований
      const [carsResponse, favoritesResponse] = await Promise.all([
        axios.get(`${url}/cars`),
        axios.get(`${url}/favorites`, setHeaders()),
      ]);

      setRecentCars(filterRecentCars(carsResponse.data));
      setFavoriteCarIds(
        favoritesResponse.data.map((favorite) => favorite.car._id)
      );
    } catch (error) {
      console.error("Помилка під час завантаження даних", error);
    }
  };

  // Викликаємо fetchInitialData при зміні `token` (вхід/вихід користувача)
  useEffect(() => {
    if (token) {
      fetchInitialData();
    }
  }, [token]); // Тепер запит оновлюється при вході та виході

  useEffect(() => {
    // fetchInitialData();

    // Підключення до WebSocket
    const socket = io(url);

    // Додаємо новий автомобіль до списку при отриманні події
    socket.on("new-car", (newCar) => {
      setRecentCars((prevCars) => {
        const updatedCars = [newCar, ...prevCars];
        return filterRecentCars(updatedCars);
      });
    });

    // Обробка події оновлення улюблених автомобілів
    socket.on("favorite-updated", ({ carId, isFavorite }) => {
      setFavoriteCarIds((prevFavorites) => {
        if (isFavorite) {
          return [...prevFavorites, carId]; // Додаємо улюблений
        } else {
          return prevFavorites.filter((id) => id !== carId); // Видаляємо з улюблених
        }
      });
    });

    // Обробка події видалення автомобіля
    socket.on("car-deleted", (deletedCarId) => {
      setRecentCars((prevCars) =>
        prevCars.filter((car) => car._id !== deletedCarId)
      );
    });

    // Очистка при розмонтуванні компонента
    return () => {
      socket.off("new-car");
      socket.off("favorite-updated");
      socket.off("car-deleted");
      socket.disconnect();
    };
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  // // Обробник кліку для деталей автомобіля
  // const handleDetailsClick = (carId) => {
  //   navigate(`/cars/${carId}`);
  // };
  const handleDetailsClick = async (carId) => {
    const socket = io(url);
    try {
      // 🔹 Відправляємо запит на сервер для додавання авто в переглянуті
      await axios.post(
        `${url}/viewed-cars`,
        { carId: carId },
        setHeaders()
      );

      // 🔹 Якщо запит успішний – відправляємо WebSocket подію
      socket.emit("viewed-updated");

      // 🔹 Переходимо на сторінку деталей авто
      navigate(`/cars/${carId}`);
    } catch (error) {
      console.error("Помилка додавання в переглянуті:", error.message);
    }
  };
 

  return (
    <div className={`recently-added-cars ${theme}`}>
      {recentCars.length > 0 ? (
        recentCars.map((car) => {
          const isFavorite = favoriteCarIds.includes(car._id);
          return (
            <div key={car._id} className="recently-added-car-container">
              <img
                src={car.imageUrl}
                alt={car.name}
                className="recently-added-car-image"
                title={car.name}
                onClick={() => handleDetailsClick(car._id)}
              />
              {isFavorite && <div className="favorite-indicator">✨</div>}
            </div>
          );
        })
      ) : (
        // <p className="no-cars-message">Автомобілі не знайдено 😔</p>
        <div className="no-cars-placeholder">
          <p>Нових автомобілів поки що немає</p>
        </div>
      )}
    </div>
  );
};

export default RecentlyAddedCars;

// if (recentCars.length === 0) {
  //   return (
  //     <div className={`recently-added-cars ${theme}`}>
  //       <p className="no-cars-message">Автомобілі не знайдено 😔</p>
  //     </div>
  //   );
  // }

  // return (
  //   <div className={`recently-added-cars ${theme}`}>
  //     {recentCars.map((car) => {
  //       const isFavorite = favoriteCarIds.includes(car._id);
  //       return (
  //         <div key={car._id} className="recently-added-car-container">
  //           <img
  //             src={car.imageUrl}
  //             alt={car.name}
  //             className="recently-added-car-image"
  //             title={car.name}
  //             onClick={() => handleDetailsClick(car._id)}
  //           />
  //           {isFavorite && <div className="favorite-indicator">✨</div>}
  //         </div>
  //       );
  //     })}
  //   </div>
  // );

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import io from "socket.io-client"; // WebSocket клієнт  21 01 25
// import "./RecentlyAddedCars.css";
// import { setHeaders, url } from "../slices/api";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../components/ThemeContext";

// const RecentlyAddedCars = () => {
//   const [recentCars, setRecentCars] = useState([]);
//   const [favoriteCarIds, setFavoriteCarIds] = useState([]); // Список ID улюблених авто

//   const navigate = useNavigate();
//   const { theme } = useTheme(); // Додаємо тему з контексту

//   const handleDetailsClick = (carId) => {
//     navigate(`/cars/${carId}`); // Перенаправляємо на сторінку деталей
//   };

//   useEffect(() => {
//     const fetchRecentCars = async () => {
//       try {
//         const response = await axios.get(`${url}/cars`);
//         const cars = response.data;
//         console.log("CARS IN RECENTLY ADDET CARS", cars)

//         const now = new Date();
//         const sevenDaysAgo = new Date();
//         sevenDaysAgo.setDate(now.getDate() - 7);

//         const filteredCars = cars.filter((car) => {
//           const createdAt = new Date(car.createdAt);
//           return createdAt >= sevenDaysAgo;
//         });

//         setRecentCars(filteredCars);
//       } catch (error) {
//         console.error("Помилка під час завантаження автомобілів", error);
//       }
//     };

//     const fetchFavorites = async () => {
//       try {
//         const response = await axios.get(`${url}/favorites`, setHeaders());
//         const favoriteIds = response.data.map((favorite) => favorite.car._id); // Отримуємо ID улюблених авто
//         setFavoriteCarIds(favoriteIds);
//       } catch (error) {
//         console.error("Помилка під час завантаження улюблених авто", error);
//       }
//     };

//     fetchRecentCars();
//     fetchFavorites();
//     // Підключення до WebSocket
//   const socket = io(url);

//   // Слухаємо подію "new-car", яка приходить від сервера
//   socket.on("new-car", (newCar) => {
//     // Перевіряємо, чи є цей автомобіль серед останніх доданих
//     setRecentCars((prevCars) => {
//       const now = new Date();
//       const sevenDaysAgo = new Date();
//       sevenDaysAgo.setDate(now.getDate() - 7);

//       const createdAt = new Date(newCar.createdAt);
//       if (createdAt >= sevenDaysAgo) {
//         return [newCar, ...prevCars]; // Додаємо новий автомобіль до списку
//       }
//       return prevCars;
//     });
//   });

//   // Чистимо підключення при розмонтуванні компонента
//   return () => {
//     socket.disconnect();
//   };
//   }, []);

//   // if (recentCars.length === 0) return "No Cars"; // Не відображати, якщо немає авто
//   if (recentCars.length === 0) {
//     return (
//       <div className={`recently-added-cars ${theme}`}>
//         <p className="no-cars-message">Автомобілі не знайдено 😔</p>
//       </div>
//     );
//   }

//   return (
//     <div className={`recently-added-cars ${theme}`}>
//       {recentCars.map((car) => (
//         <div key={car._id} className="recently-added-car-container">
//           <img
//             // key={car._id}
//             src={car.imageUrl}
//             alt={car.name}
//             className="recently-added-car-image"
//             title={car.name}
//             onClick={() => handleDetailsClick(car._id)}
//           />
//           {favoriteCarIds.includes(car._id) && (
//             <div className="favorite-indicator">✨</div>
//           )} {/* Індикатор */}
//         </div>

//       ))}
//     </div>
//   );
// };

// export default RecentlyAddedCars;
