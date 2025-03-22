import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./CarDetails.css"; // Стилі для сторінки
import { url, setHeaders } from "../slices/api"; // Імпорт setHeaders для авторизації
import { useTheme } from "../components/ThemeContext";
import { io } from "socket.io-client";
import { FaArrowLeft } from "react-icons/fa"; // Іконка стрілки
import AddCarSpecsModal from "./AddCarSpecsModal";

const socket = io(url); // Підключаємо WebSocket клієнт

const CarDetails = () => {
  const { id } = useParams(); // Отримуємо ID автомобіля з URL
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false); // Для відображення статусу
  const [hovering, setHovering] = useState(false);
  const { theme } = useTheme(); // Додаємо тему з контексту
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // Стейт для показу модалки
  // const [vinCode, setVinCode] = useState(""); // ✅ Додаємо стан для VIN-коду

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`${url}/cars/${id}`); // API для завантаження деталей
        console.log("CAR IN DETAILS", response.data);
        setCar(response.data);

        // Перевіряємо, чи є автомобіль у списку улюблених
        const favoriteResponse = await axios.get(
          `${url}/favorites`,
          setHeaders()
        );
        const isFavoriteCar = favoriteResponse.data.some(
          (favorite) => favorite.car._id === id //Якщо знайдеться такий автомобіль, змінна isFavoriteCar буде true
        );
        setIsFavorite(isFavoriteCar);

        setLoading(false);
      } catch (err) {
        console.error(
          "Error fetching car details:",
          err.response?.data || err.message
        );
        setError("Не вдалося завантажити дані автомобіля.");
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const addToFavorites = async () => {
    try {
      // було: `${url}/cars/${id}/favorites`, // URL для запиту
      await axios.post(
        `${url}/favorites/${id}`, // URL для запиту
        {}, // Тіло запиту (може бути порожнім)
        setHeaders() // Передаємо токен
      );
      setIsFavorite(true); // Змінюємо статус на "Улюблений"
      // Надсилаємо подію WebSocket для оновлення лічильника улюблених
      socket.emit("favorite-updated", { carId: id, isFavorite: true });
      alert("Автомобіль успішно додано в улюблені!");

      // console.log("RESPONSE ADD TO FAVORITE", response.data)
    } catch (err) {
      // setIsFavorite("error");
      console.error(err.response?.data || "Помилка сервера");
      alert(err.response?.data?.message || "Не вдалося додати в улюблене.");
    }
  };

  const removeFromFavorites = async () => {
    try {
      await axios.delete(`${url}/favorites/${id}`, setHeaders());
      setIsFavorite(false);
      socket.emit("favorite-updated", { carId: id, isFavorite: false });
      alert("Автомобіль видалено з улюблених!");
    } catch (err) {
      console.error(err.response?.data || "Помилка сервера");
      alert(err.response?.data?.message || "Не вдалося видалити з улюблених.");
    }
  };


  // Функція для повернення назад
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  return (
    // <div className="car-details">
    <div className={`car-details ${theme}`}>
      <div className="image-container">
        {/* Кнопка для повернення назад */}
        <button className="back-button" onClick={handleBack}>
          {/* <FaArrowLeft size={20} /> */}
          <FaArrowLeft />
        </button>
        <img src={car.imageUrl} alt={car.name} className="car-details-image" />
      </div>
      <h1>{car.name}</h1>
      <p>
        <strong>Бренд:</strong> {car.brand}
      </p>
      <p>
        <strong>Рік:</strong> {car.year}
      </p>
      <p>
        <strong>Опис:</strong> {car.description}
      </p>
      <div className={`add-specs ${theme}`} onClick={() => setShowModal(true)}>
        Додати характеристики
      </div>

      {/* Модальне вікно */}
      {showModal && (
        
        <AddCarSpecsModal 
  show={showModal} 
  onClose={() => setShowModal(false)} 
  theme={theme} 
  car={car} 
/>
      )}

      <button
        onClick={isFavorite ? removeFromFavorites : addToFavorites}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`favorite-button ${isFavorite ? "added-to-favorites" : ""}`}
      >
        {isFavorite
          ? hovering
            ? "Видалити з улюблених"
            : "Улюблений"
          : "Додати в улюблене"}
      </button>
    </div>
  );
};

export default CarDetails;


// Цей код знаходиться компоненті AddCarSpecsModal
// <>
        //   <div
        //     className="modal-overlay"
        //     onClick={() => setShowModal(false)}
        //   ></div>
        //   <div className={`modal-specs ${theme}`}>
        //     <h3 className="modal-text">Як додати характеристики?</h3>

            
        //     <input
        //       type="text"
        //       placeholder="Введіть VIN (необов'язково)"
        //       value={vinCode}
        //       onChange={(e) => setVinCode(e.target.value)}
        //       className={`vin-input ${theme}`}
        //     />
        //     <button onClick={handleGCSSearch} disabled={loading}>
        //       {loading ? "Завантаження..." : "Автоматично (GCS)"}
        //     </button>
        //     <button onClick={handleBingSearch}>Автоматично (Bing)</button>
        //     <button onClick={handleAISearch}>Автоматично (AI)</button>
        //     <button onClick={handleViewOnWikipedia}>
        //       Переглянути у Wikipedia
        //     </button>
        //     <button onClick={() => navigate(`/add-car-specs/${car._id}`)}>
        //       Вручну
        //     </button>
        //     <button onClick={() => setShowModal(false)}>Закрити</button>
        //   </div>
  // </>

  // Всі функції пошуку характеристик перенесені в компонент AddCarSpecsModal
  //   const handleAutoAddSpecs = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${url}/car-specs/ai-search?make=${car?.brand}&model=${car?.name}&year=${car?.year}&carId=${car?._id}`,
  //       setHeaders()
  //     );

  //     if (response.data) {
  //       alert("Характеристики успішно додані!");
  //     } else {
  //       alert("Не вдалося отримати характеристики.");
  //     }
  //   } catch (error) {
  //     console.error("❌ Помилка AI-пошуку:", error);
  //     alert("Помилка під час отримання характеристик.");
  //   }
  // };

  // const handleGCSSearch = async () => {
  //   // if (!car) return;
  //   try {
  //     const response = await axios.post(
  //       `${url}/car-specs/google-search`,
  //       {
  //         make: car?.brand,
  //         model: car?.name,
  //         year: car?.year,
  //         carId: car?._id,
  //         vin: vinCode || undefined, // ✅ Передаємо VIN-код, якщо він є
  //       },
  //       setHeaders()
  //     );
  //     console.log("Результати GCS:", response.data);
  //     alert("Характеристики успішно додано за допомогою Google Cloud Search!");
  //   } catch (error) {
  //     console.error("Помилка при GCS пошуку:", error);
  //     alert("Не вдалося отримати характеристики через Google Cloud Search.");
  //   }
  // };

  // async function handleBingSearch() {
  //   const response = await fetch(
  //     "http://localhost:5000/api/carspecs/bing-search",
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         make: "BMW",
  //         model: "X6",
  //         year: "2024",
  //         carId: "ID_МАШИНИ",
  //       }),
  //     }
  //   );

  //   const data = await response.json();
  //   console.log("Результати Bing:", data);
  // }

  // const handleAISearch = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${url}/car-specs/ai-search`,
  //       {
  //         make: car?.brand,
  //         model: car?.name,
  //         year: car?.year,
  //         carId: car?._id,
  //       },
  //       setHeaders()
  //     );
  //     console.log(response.data);
  //     alert("Характеристики успішно додано за допомогою AI!");
  //   } catch (error) {
  //     console.error("Помилка при AI пошуку:", error);
  //     alert("Не вдалося отримати характеристики через AI.");
  //   }
  // };

  // //   // ✅ Отримання характеристик з AUTO.RIA
  // //   const handleAutoAddSpecs = async () => {
  // //   if (!car) return;

  // //   try {
  // //     const response = await axios.get(
  // //       `${url}/car-specs/auto-ria?make=${car.brand}&model=${car.name}&year=${car.year}&carId=${car._id}`,
  // //       setHeaders()
  // //     );

  // //     if (response.data) {
  // //       alert("✅ Характеристики успішно отримано та збережено!");
  // //     } else {
  // //       alert("⚠️ Не вдалося знайти характеристики на AUTO.RIA.");
  // //     }
  // //   } catch (error) {
  // //     console.error("❌ Помилка отримання характеристик:", error);
  // //     alert("❌ Помилка під час отримання характеристик.");
  // //   }
  // // };

  // // const handleAutoAddSpecs = async () => {
  // //   try {
  // //     const response = await axios.get(
  // //       `${url}/car-specs/auto-ria/search?make=${car?.brand}&model=${car?.name}&year=${car?.year}`,
  // //       setHeaders()
  // //     );

  // //     if (response.data) {
  // //       alert("Характеристики авто успішно отримані з AUTO.RIA!");
  // //       console.log("AUTO.RIA Specs:", response.data);
  // //     } else {
  // //       alert("Не вдалося знайти характеристики авто.");
  // //     }
  // //   } catch (error) {
  // //     console.error("Помилка пошуку авто на AUTO.RIA:", error);
  // //     alert("Помилка під час отримання характеристик.");
  // //   }
  // // };

  // // ✅ Відкриття Wikipedia в новій вкладці
  // const handleViewOnWikipedia = () => {
  //   const wikiUrl = `https://en.wikipedia.org/wiki/${car?.brand}_${car?.name}_${car?.year}`;
  //   window.open(wikiUrl, "_blank");
  // };



// const handleAutoAddSpecs = async () => {
//   try {
//     const response = await axios.get(
//       `${url}/car-specs/scrape?make=${car?.brand}&model=${car?.name}&year=${car?.year}`, setHeaders()
//     );
//     console.log("RESPONSE SPECS : ", response)

//     if (response.data) {
//       await axios.post(`${url}/car-specs`, {
//         carId: car?._id,
//         specifications: response.data,
//       });
//       alert("Характеристики додані автоматично!");
//     } else {
//       alert("Не вдалося знайти характеристики. Спробуйте вручну.");
//     }
//   } catch (error) {
//     console.error("Помилка парсингу:", error);
//     alert("Помилка під час отримання характеристик.");
//   }
//   setShowModal(false);
// };

// const handleAutoAddSpecs = async () => {
// try {
//   const response = await axios.get(
//     `${url}/car-specs/scrape?make=${car?.brand}&model=${car?.name}&year=${car?.year}`,
//     setHeaders()
//   );

//   if (response.data.wikipediaUrl) {
//     window.open(response.data.wikipediaUrl, "_blank"); // Відкриваємо сторінку Wikipedia
//   } else {
//     alert("Не вдалося знайти сторінку Wikipedia.");
//   }
// } catch (error) {
//   console.error("Помилка парсингу:", error);
//   alert("Помилка під час отримання сторінки Wikipedia.");
// }
// };

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import "./CarDetails.css"; // Стилі для сторінки
// import { url } from "../slices/api";

// const CarDetails = () => {
//   const { id } = useParams(); // Отримуємо ID автомобіля з URL
//   const [car, setCar] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchCarDetails = async () => {
//       try {
//         const response = await axios.get(`${url}/cars/${id}`); // API для завантаження деталей
//         setCar(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Не вдалося завантажити дані автомобіля.");
//         setLoading(false);
//       }
//     };

//     fetchCarDetails();
//   }, [id]);

//   if (loading) return <p>Завантаження...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="car-details">
//       <h1>{car.name}</h1>
//       <img src={car.imageUrl} alt={car.name} className="car-details-image" />
//       <p><strong>Бренд:</strong> {car.brand}</p>
//       <p><strong>Рік:</strong> {car.year}</p>
//       <p><strong>Опис:</strong> {car.description}</p>
//       <button onClick={() => alert("Додано в улюблене!")}>Додати в улюблене</button>
//     </div>
//   );
// };

// export default CarDetails;
