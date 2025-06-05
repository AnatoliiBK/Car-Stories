import React, { useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { url, setHeaders } from "../slices/api";
import "./CarDetails.css";
import { useSelector } from "react-redux";

const AddCarSpecsModal = ({ show, onClose, theme, car }) => {
  const navigate = useNavigate();
  const [vinCode, setVinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.auth);

  const handleGCSSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${url}/car-specs/google-search`,
        {
          make: car?.brand,
          model: car?.name,
          year: car?.year,
          carId: car?._id,
          vin: vinCode || undefined,
          createdBy: currentUser?._id, // ✅
        },
        setHeaders()
      );
      console.log("Результати GCS:", response.data);
      alert("Характеристики успішно додано за допомогою Google Cloud Search!");
    } catch (error) {
      console.error("Помилка при GCS пошуку:", error);
      alert("Не вдалося отримати характеристики через Google Cloud Search.");
    } finally {
      setLoading(false);
    }
  };

  const handleBingSearch = async () => {
    try {
      const response = await axios.post(`${url}/car-specs/bing-search`, {
        make: car?.brand,
        model: car?.name,
        year: car?.year,
        carId: car?._id,
        createdBy: currentUser?._id,
      });
      console.log("Результати Bing:", response.data);
      alert("Характеристики додано за допомогою Bing!");
    } catch (error) {
      console.error("Помилка при Bing пошуку:", error);
      alert("Не вдалося отримати характеристики через Bing.");
    }
  };

  const handleMSNSearch = async () => {
  try {
    const response = await axios.post(
      `${url}/car-specs/msn-search`,
      {
        make: car?.brand,
        model: car?.name,
        year: car?.year,
        carId: car?._id,
        createdBy: currentUser?._id,
      },
      setHeaders()
    );

    console.log("Результати MSN:", response.data);
    alert("Характеристики успішно додано за допомогою MSN!");
  } catch (error) {
    console.error("Помилка при MSN пошуку:", error);
    if (error.response?.status === 409) {
      alert("Характеристики з MSN вже збережені для цього авто.");
    } else {
      alert("Не вдалося отримати характеристики через MSN.");
    }
  }
};


  const handleAISearch = async () => {
    try {
      const response = await axios.post(
        `${url}/car-specs/ai-search`,
        {
          make: car?.brand,
          model: car?.name,
          year: car?.year,
          carId: car?._id,
          createdBy: currentUser?._id,
        },
        setHeaders()
      );
      console.log(response.data);
      alert("Характеристики успішно додано за допомогою AI!");
    } catch (error) {
      console.error("Помилка при AI пошуку:", error);
      alert("Не вдалося отримати характеристики через AI.");
    }
  };

  const handleViewOnWikipedia = () => {
    const wikiUrl = `https://en.wikipedia.org/wiki/${car?.brand}_${car?.name}_${car?.year}`;
    window.open(wikiUrl, "_blank");
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className={`modal-specs ${theme}`}>
        <h3 className="modal-text">Як додати характеристики?</h3>

        <input
          type="text"
          placeholder="Введіть VIN (необов'язково)"
          value={vinCode}
          onChange={(e) => setVinCode(e.target.value)}
          className={`vin-input ${theme}`}
        />

        <button onClick={handleGCSSearch} disabled={loading}>
          {loading ? "Завантаження..." : "Автоматично (GCS)"}
        </button>
        <button onClick={handleBingSearch}>Автоматично (Bing)</button>
        <button onClick={handleMSNSearch}>Автоматично (MSN)</button>
        <button onClick={handleAISearch}>Автоматично (AI)</button>
        <button onClick={handleViewOnWikipedia}>Переглянути у Wikipedia</button>
        {/* <button onClick={() => navigate(`/add-car-specs/${car._id}`)}>Вручну</button> */}
        <button onClick={onClose}>Закрити</button>
      </div>
    </>
  );
};

export default AddCarSpecsModal;



// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { url, setHeaders } from "../slices/api";
// import "./CarDetails.css";

// const AddCarSpecsModal = ({ show, onClose, theme, car }) => {
//   const navigate = useNavigate();
//   const [vinCode, setVinCode] = useState(""); // Переносимо стан VIN-коду
//   const [loading, setLoading] = useState(false); // Стан для кнопки "Завантаження..."

//   const handleGCSSearch = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `${url}/car-specs/google-search`,
//         {
//           make: car?.brand,
//           model: car?.name,
//           year: car?.year,
//           carId: car?._id,
//           vin: vinCode || undefined, // Передаємо VIN-код, якщо він є
//         },
//         setHeaders()
//       );
//       console.log("Результати GCS:", response.data);
//       alert("Характеристики успішно додано за допомогою Google Cloud Search!");
//     } catch (error) {
//       console.error("Помилка при GCS пошуку:", error);
//       alert("Не вдалося отримати характеристики через Google Cloud Search.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBingSearch = async () => {
//     try {
//       const response = await axios.post(`${url}/car-specs/bing-search`, {
//         make: car?.brand,
//         model: car?.name,
//         year: car?.year,
//         carId: car?._id,
//       });
//       console.log("Результати Bing:", response.data);
//       alert("Характеристики додано за допомогою Bing!");
//     } catch (error) {
//       console.error("Помилка при Bing пошуку:", error);
//       alert("Не вдалося отримати характеристики через Bing.");
//     }
//   };

//   const handleAISearch = async () => {
//     try {
//       const response = await axios.post(
//         `${url}/car-specs/ai-search`,
//         {
//           make: car?.brand,
//           model: car?.name,
//           year: car?.year,
//           carId: car?._id,
//         },
//         setHeaders()
//       );
//       console.log(response.data);
//       alert("Характеристики успішно додано за допомогою AI!");
//     } catch (error) {
//       console.error("Помилка при AI пошуку:", error);
//       alert("Не вдалося отримати характеристики через AI.");
//     }
//   };

//   const handleViewOnWikipedia = () => {
//     const wikiUrl = `https://en.wikipedia.org/wiki/${car?.brand}_${car?.name}_${car?.year}`;
//     window.open(wikiUrl, "_blank");
//   };

//   if (!show) return null;

//   return (
//     <>
//       <div className="modal-overlay" onClick={onClose}></div>
//       <div className={`modal-specs ${theme}`}>
//         <h3 className="modal-text">Як додати характеристики?</h3>

//         {/* Поле для введення VIN-коду */}
//         <input
//           type="text"
//           placeholder="Введіть VIN (необов'язково)"
//           value={vinCode}
//           onChange={(e) => setVinCode(e.target.value)}
//           className={`vin-input ${theme}`}
//         />
//         <button onClick={handleGCSSearch} disabled={loading}>
//           {loading ? "Завантаження..." : "Автоматично (GCS)"}
//         </button>
//         <button onClick={handleBingSearch}>Автоматично (Bing)</button>
//         <button onClick={handleAISearch}>Автоматично (AI)</button>
//         <button onClick={handleViewOnWikipedia}>Переглянути у Wikipedia</button>
//         <button onClick={() => navigate(`/add-car-specs/${car._id}`)}>Вручну</button>
//         <button onClick={onClose}>Закрити</button>
//       </div>
//     </>
//   );
// };

// export default AddCarSpecsModal;
