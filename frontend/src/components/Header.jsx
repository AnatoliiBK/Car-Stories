import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../slices/authSlice";
import { fetchViewedCars } from "../slices/viewedCarsSlice"; // ✅ 5 02 25
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import axios from "axios";
import { url, setHeaders } from "../slices/api";
import "./Header.css";
import { useTheme } from "../components/ThemeContext";
// import Flag from "../assets/racing flag waving in the wind.webp";

const Header = () => {
  const auth = useSelector((state) => state.auth);
  const { usersList } = useSelector((state) => state.users);
  const viewedCars = useSelector((state) => state.viewedCars.viewedCars); // ✅ Беремо з Redux 5 02 25
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const user = usersList?.find((u) => u._id === auth._id);
  const [userAvatar, setUserAvatar] = useState(user?.avatar || "");

  const [carCount, setCarCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  // const [recentlyAddedCount, setRecentlyAddedCount] = useState(0); // 1 02 25
  const [classicCarCount, setClassicCarCount] = useState(0); // Лічильник класичних авто
  const [viewedCarsCount, setViewedCarsCount] = useState(0); // 7 02 25
  const [myCarsCount, setMyCarsCount] = useState(0);

  // 🔸 Стан для мобільного меню
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 🔸 Використовуємо рефи для визначення кліку поза меню
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  // 📌 Закриття меню при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  console.log("VIEWED CARS VIEWED CARS : ", viewedCars);

  // 🔹 Функція для отримання улюблених авто для поточного користувача
  const fetchFavoritesCount = async () => {
    try {
      const response = await axios.get(`${url}/favorites`, setHeaders());
      setFavoritesCount(response.data.length);
    } catch (err) {
      console.error("Помилка завантаження улюблених авто:", err);
    }
  };

  // 🔹 Отримуємо кількість автомобілів, які належать поточному користувачеві ✅
  const fetchMyCarsCount = async () => {
    try {
      const response = await axios.get(`${url}/cars/my`, setHeaders()); // Новий ендпоінт
      setMyCarsCount(response.data.length);
    } catch (err) {
      console.error("Помилка отримання моїх авто:", err);
    }
  };

  // 🔹 Новий useEffect: при зміні auth._id завантажуємо переглянуті авто для поточного користувача 7 02 25
  useEffect(() => {
    if (auth._id) {
      dispatch(fetchViewedCars());
    }
  }, [auth._id, dispatch]);

  // 🔹 Синхронізуємо локальний лічильник переглянутих авто з даними з Redux 7 02 25
  useEffect(() => {
    setViewedCarsCount(viewedCars.length);
  }, [viewedCars]);

  // Виклик fetchFavoritesCount при зміні auth._id (тобто, коли входить новий користувач)
  useEffect(() => {
    if (auth._id) {
      fetchFavoritesCount();
      fetchMyCarsCount();
    } else {
      setFavoritesCount(0);
      setMyCarsCount(0);
    }
  }, [auth._id]);

  useEffect(() => {
    // 🔹 Функція для отримання всіх автомобілів
    const fetchCarCounts = async () => {
      try {
        const response = await axios.get(`${url}/cars`, setHeaders());

        const classicCars = response.data.filter((car) => car.year < 1987);

        setCarCount(response.data.length); // Усі авто
        setClassicCarCount(classicCars.length); // Класичні авто
      } catch (error) {
        console.error("Помилка отримання автомобілів:", error.message);
      }
    };

    // 7 02 25 винесено поза цей useEffect
    // // 🔹 Функція для отримання улюблених авто
    // const fetchFavoritesCount = async () => {
    //   try {
    //     const response = await axios.get(`${url}/favorites`, setHeaders());
    //     setFavoritesCount(response.data.length);
    //   } catch (err) {
    //     console.error("Помилка завантаження улюблених авто:", err);
    //   }
    // };

    // видалено 5 02 25
    // // Отримання переглянутих авто
    // const updateViewedCarsCount = () => {
    //   const viewedCars = JSON.parse(localStorage.getItem("viewedCars")) || [];
    //   setViewedCarsCount(viewedCars.length);
    // };

    // dispatch(fetchViewedCars()); // 🔹 Отримуємо переглянуті авто з бекенду через Redux 7 02 25
    fetchCarCounts();
    // fetchFavoritesCount(); 7 02 25 видалено
    // видалено 5 02 25
    // updateViewedCarsCount(); // Оновлюємо кількість переглянутих авто при завантаженні

    // Підключення до WebSocket
    const socket = io(url);

    // Коли додається новий автомобіль
    socket.on("new-car", (newCar) => {
      setCarCount((prev) => prev + 1);

      // Якщо авто класичне (до 1987 року) — додаємо до лічильника
      if (newCar.year < 1987) {
        setClassicCarCount((prev) => prev + 1);
      }
    });

    // Коли авто видаляється
    socket.on("car-deleted", (deletedCarId) => {
      setCarCount((prev) => Math.max(prev - 1, 0));
      setClassicCarCount((prev) => Math.max(prev - 1, 0));
    });

    // Коли авто додається в улюблені або видаляється з них
    socket.on("favorite-updated", ({ isFavorite }) => {
      setFavoritesCount((prev) =>
        isFavorite ? prev + 1 : Math.max(prev - 1, 0)
      );
    });

    // 🔹 Отримуємо оновлення переглянутих авто через WebSocket
    socket.on("viewed-updated", () => {
      dispatch(fetchViewedCars());
    });

    // видалено 5 02 25
    // // 📢 Підписуємося на зміни у `localStorage`
    // window.addEventListener("storage", updateViewedCarsCount);

    // socket.on("viewed-car", updateViewedCarsCount);

    return () => {
      // window.removeEventListener("storage", handleStorageChange);
      socket.off("new-car");
      socket.off("car-deleted");
      socket.off("favorite-updated");
      socket.off("viewed-updated");
      // socket.off("viewed-car", updateViewedCarsCount);
      // window.removeEventListener("storage", updateViewedCarsCount);
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <div className="header-container">
      <header className="header">
      <div
        ref={toggleRef}
        className={`mobile-toggle ${isMobileMenuOpen ? "rotated" : ""}`}
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
      />
      {/* <nav className="header-nav"> */}
      <nav
        ref={menuRef}
        className={`header-nav ${isMobileMenuOpen ? "open" : ""} ${theme}`}
      >
        {auth._id ? (
          <>
            {/* <Link to="/" className={`header-link ${location.pathname === "/" ? "active" : ""}`}>
              <img src={Flag} alt="Головна" className="header-icon" />
            </Link> */}
            <Link
              to="/cars"
              className={`header-link ${
                location.pathname === "/cars" ? "active" : ""
              }`}
            >
              Автомобілі світу{" "}
              {carCount > 0 && (
                <span className="pending-badge">{carCount}</span>
              )}
            </Link>
            <Link
              to="/classic-cars"
              className={`header-link ${
                location.pathname === "/classic-cars" ? "active" : ""
              }`}
            >
              Класичні автомобілі{" "}
              {classicCarCount > 0 && (
                <span className="pending-badge">{classicCarCount}</span>
              )}
            </Link>
            <Link
              to="/favorites"
              className={`header-link ${
                location.pathname === "/favorites" ? "active" : ""
              }`}
            >
              Улюблені{" "}
              {favoritesCount > 0 && (
                <span className="pending-badge">{favoritesCount}</span>
              )}
            </Link>
            <Link
              to="/viewed-cars"
              className={`header-link ${
                location.pathname === "/viewed-cars" ? "active" : ""
              }`}
            >
              Переглянуті{" "}
              {viewedCarsCount > 0 && (
                <span className="pending-badge">{viewedCarsCount}</span>
              )}
            </Link>
            <Link
              to="/my-cars"
              className={`header-link ${
                location.pathname === "/my-cars" ? "active" : ""
              }`}
            >
              Мої авто{" "}
              {myCarsCount > 0 && (
                <span className="pending-badge">{myCarsCount}</span>
              )}
            </Link>
            <Link
              to="/cart"
              className={`header-link ${
                location.pathname === "/cart" ? "active" : ""
              }`}
            >
              Кошик
            </Link>
            <Link
              to="/"
              className="header-link"
              onClick={() => {
                dispatch(logoutUser(null));
                setUserAvatar("");
                navigate("/");
              }}
            >
              Вихід
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`header-link ${
                location.pathname === "/login" ? "active" : ""
              }`}
            >
              Вхід
            </Link>
            <Link
              to="/register"
              className={`header-link ${
                location.pathname === "/register" ? "active" : ""
              }`}
            >
              Реєстрація
            </Link>
          </>
        )}
      </nav>
    </header>
    </div>
    
  );
};

export default Header;

// useEffect(() => {
//   // Функція для завантаження початкової кількості авто в очікуванні
//   const fetchPendingCars = async () => {
//     try {
//       const response = await axios.get(`${url}/cars`, setHeaders());
//       setCarCount(response.data.length);
//     } catch (error) {
//       console.error("Помилка отримання авто:мобілів", error.message);
//     }
//   };

//   // Функція для завантаження початкової кількості улюблених авто
//   const fetchFavoritesCount = async () => {
//     try {
//       const response = await axios.get(`${url}/favorites`, setHeaders());
//       setFavoritesCount(response.data.length);
//     } catch (err) {
//       console.error("Помилка завантаження улюблених авто:", err);
//     }
//   };

//   const fetchRecentlyAddedCars = async () => {
//     try {
//       const response = await axios.get(`${url}/cars`);
//       const recentCars = response.data.filter((car) => {
//         const now = new Date();
//         const timeApproved = new Date();
//         timeApproved.setDate(now.getDate() - 10);
//         return new Date(car.createdAt) >= timeApproved;
//       });
//       setRecentlyAddedCount(recentCars.length);
//     } catch (error) {
//       console.error("Помилка отримання останніх авто:", error.message);
//     }
//   };

//   fetchPendingCars(); // Виконуємо запит при завантаженні
//   fetchFavoritesCount();
//   fetchRecentlyAddedCars();

//   // Підключення до WebSocket
//   const socket = io(url);

//   // // 🔹 Коли додано новий автомобіль у список очікування (користувач надіслав авто)
//   // socket.on("pending-car-added", (newCar) => {
//   //   setPendingCount((prev) => prev + 1);
//   // });

//   // 🔹 Коли авто схвалене адміністратором (його видаляють зі списку очікування)
//   socket.on("new-car", (approvedCar) => {
//     setCarCount((prev) => Math.max(prev + 1, 0));
//   });

//   // 🔹 Коли авто повністю видалене (з будь-якого списку)
//   socket.on("car-deleted", (deletedCarId) => {
//     setCarCount((prev) => Math.max(prev - 1, 0));
//     setRecentlyAddedCount((prev) => Math.max(prev - 1, 0));
//   });

//   // 🔹 Коли авто додано до улюблених чи видалено з улюблених
//   socket.on("favorite-updated", ({ isFavorite }) => {
//     setFavoritesCount((prev) =>
//       isFavorite ? prev + 1 : Math.max(prev - 1, 0)
//     );
//   });

//   // Коли додається новий автомобіль
//   socket.on("new-car", (newCar) => {
//     setRecentlyAddedCount((prev) => prev + 1);
//   });

//   return () => {
//     // socket.off("pending-car-added");
//     socket.off("new-car");
//     socket.off("car-deleted");
//     socket.off("favorite-updated");
//     socket.disconnect(); // Відключаємо WebSocket при розмонтуванні
//   };
// }, []);
