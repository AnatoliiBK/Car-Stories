import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../slices/api";
import "./CarSpecsPage.css";
import { useTheme } from "../components/ThemeContext";
import { useSelector } from "react-redux";

const CarSpecsPage = () => {
  const { carId } = useParams();
  const [specs, setSpecs] = useState(null);
  const { theme } = useTheme();
  const currentUser = useSelector((state) => state.auth);
  const navigate = useNavigate();
  console.log("CAR ID PAGE : ", carId);
  console.log("CURRENT USER IN SPECS PAGE", currentUser)
  console.log("SPECS : ", specs);

  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        const response = await axios.get(`${url}/car-specs/${carId}`);
        console.log("PAGE CAR SPECS : ", response);
        setSpecs(response.data);
      } catch (error) {
        console.error("Помилка завантаження характеристик:", error);
      }
    };

    fetchSpecs();
  }, [carId]);

  if (!specs) {
    return <p className="no-specs">Характеристики відсутні</p>;
  }

  const isOwnerOrAdmin =
    currentUser &&
    (currentUser._id === specs.createdBy._id || currentUser.isAdmin === true);
    console.log("IS OWNER OR ADMIN : ", isOwnerOrAdmin);
  

  return (
    <div className={`car-specs-container ${theme}`}>
      <h2 className="car-title">Дещо про авто {specs.carId.brand} {specs.carId.name} {specs.carId.year }</h2>
      <p className="car-title">Доданний {specs.createdBy.name}</p>
      {isOwnerOrAdmin && (
        <div className={`specs-button-container ${theme}`}>
          <button className={`edit-specs-button ${theme}`} onClick={() => navigate(`/car-specs/edit/${specs.carId._id}`)}>
            Редагувати характеристики ✏️
          </button>
          <button className={`edit-specs-button ${theme}`}>Видалити характеристики ❌</button>
        </div>
      )}

      {specs.fuelType && (
        <div className="specs-section">
          {specs.fuelType === "бензин" || specs.fuelType === "дизель" ? (
            <div className={`specs-box ${theme}`}>
              <p>
                <strong>VIN-код:</strong>{" "}
                {specs.vin ?? "Немає даних"}
              </p>
              <p>
                <strong>Об'єм двигуна:</strong>{" "}
                {specs.combustionEngine?.engineDisplacement ?? "Немає даних"} л
              </p>
              <p></p>
              <p>
                <strong>Потужність:</strong>{" "}
                {specs.combustionEngine?.horsepower ?? "Немає даних"} к. с.
              </p>
              <p>
                <strong>Крутний момент:</strong>{" "}
                {specs.combustionEngine?.torque ?? "Немає даних"} Нм
                {/* <strong>Крутний момент:</strong> {specs.combustionEngine?.torque}{" "} */}
              </p>
              <p>
                <strong>Витрата пального:</strong>{" "}
                {specs.combustionEngine?.fuelConsumption ?? "Немає даних"}{" "}
                л/100км
              </p>
              <p>
                <strong>Коробка передач:</strong>{" "}
                {specs.combustionEngine?.transmission ?? "Немає даних"}
              </p>
            </div>
          ) : specs.fuelType === "гібрид" ? (
            <div className={`specs-box ${theme}`}>
              <p>
                <strong>Тип гібрида:</strong>{" "}
                {specs.hybrid?.hybridType ?? "Немає даних"}
              </p>
              <p>
                <strong>Об'єм двигуна:</strong>{" "}
                {specs.hybrid?.engineDisplacement ?? "Немає даних"} л
              </p>
              <p>
                <strong>Потужність електромотора:</strong>{" "}
                {specs.hybrid?.electricMotorPower ?? "Немає даних"} кВт
              </p>
              <p>
                <strong>Загальна потужність:</strong>{" "}
                {specs.hybrid?.totalHorsepower ?? "Немає даних"} к.с.
              </p>
              <p>
                <strong>Запас ходу на електро:</strong>{" "}
                {specs.hybrid?.electricRange ?? "Немає даних"} км
              </p>
            </div>
          ) : specs.fuelType === "електро" ? (
            <div className={`specs-box ${theme}`}>
              <p>
                <strong>Ємність батареї:</strong>{" "}
                {specs.electric?.batteryCapacity ?? "Немає даних"} кВт⋅год
              </p>
              <p>
                <strong>Запас ходу:</strong>{" "}
                {specs.electric?.range ?? "Немає даних"} км
              </p>
              <p>
                <strong>Потужність електромотора:</strong>{" "}
                {specs.electric?.electricMotorPower ?? "Немає даних"} кВт
              </p>
              <p>
                <strong>Час зарядки:</strong>{" "}
                {specs.electric?.chargeTime ?? "Немає даних"}
              </p>
              <p>
                <strong>Тип зарядного роз'єму:</strong>{" "}
                {specs.electric?.chargePort ?? "Немає даних"}
              </p>
            </div>
          ) : (
            <p className="no-data">Немає даних</p>
          )}
        </div>
      )}

      {specs.additionalSpecs &&
        Object.keys(specs.additionalSpecs).length > 0 && (
          <div className={`additional-specs ${theme}`}>
            <h3>Додаткові характеристики</h3>
            {Object.keys(specs.additionalSpecs).length > 0 ? (
              <ul>
                {Object.entries(specs.additionalSpecs).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">Немає додаткових характеристик.</p>
            )}
          </div>
        )}

      {specs.usefulLinks && specs.usefulLinks.length > 0 && (
        <div className={`useful-links ${theme}`}>
          <h3>Корисні посилання</h3>
          {specs.usefulLinks?.length > 0 ? (
            <ul>
              {specs.usefulLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">Немає корисних посилань.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CarSpecsPage;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { url } from "../slices/api";

// const CarSpecsPage = () => {
//   const { carId } = useParams();
//   const [specs, setSpecs] = useState(null);
//   console.log("CAR ID PAGE : ", carId)

//   useEffect(() => {
//     const fetchSpecs = async () => {
//       try {
//         const response = await axios.get(`${url}/car-specs/${carId}`);
//         setSpecs(response.data);
//       } catch (error) {
//         console.error("Помилка завантаження характеристик:", error);
//       }
//     };

//     fetchSpecs();
//   }, [carId]);

//   if (!specs) {
//     return <p>Завантаження характеристик...</p>;
//   }

//   return (
//     <div>
//       <h2>Характеристики {specs.fuelType} авто</h2>
//       {specs.fuelType === "бензин" || specs.fuelType === "дизель" ? (
//         <div>
//           <p>Об'єм двигуна: {specs.combustionEngine?.engineDisplacement} л</p>
//           <p>Потужність: {specs.combustionEngine?.horsepower} к.с.</p>
//           <p>Крутний момент: {specs.combustionEngine?.torque} Нм</p>
//           <p>Витрата пального: {specs.combustionEngine?.fuelConsumption} л/100км</p>
//           <p>Коробка передач: {specs.combustionEngine?.transmission}</p>
//         </div>
//       ) : specs.fuelType === "гібрид" ? (
//         <div>
//           <p>Тип гібрида: {specs.hybrid?.hybridType}</p>
//           <p>Об'єм двигуна: {specs.hybrid?.engineDisplacement} л</p>
//           <p>Потужність електромотора: {specs.hybrid?.electricMotorPower} кВт</p>
//           <p>Загальна потужність: {specs.hybrid?.totalHorsepower} к.с.</p>
//           <p>Запас ходу на електро: {specs.hybrid?.electricRange} км</p>
//         </div>
//       ) : specs.fuelType === "електро" ? (
//         <div>
//           <p>Ємність батареї: {specs.electric?.batteryCapacity} кВт⋅год</p>
//           <p>Запас ходу: {specs.electric?.range} км</p>
//           <p>Потужність електромотора: {specs.electric?.electricMotorPower} кВт</p>
//           <p>Час зарядки: {specs.electric?.chargeTime}</p>
//           <p>Тип зарядного роз'єму: {specs.electric?.chargePort}</p>
//         </div>
//       ) : (
//         <p>Немає даних</p>
//       )}
//     </div>
//   );
// };

// export default CarSpecsPage;

// <div>
//   <h2>Характеристики {specs.fuelType} авто</h2>
//   {/* Виведення характеристик в залежності від типу палива */}
//   {specs.fuelType === "бензин" || specs.fuelType === "дизель" ? (
//     <div>
//       <p>Об'єм двигуна: {specs.combustionEngine?.engineDisplacement} л</p>
//       <p>Потужність: {specs.combustionEngine?.horsepower} к.с.</p>
//       <p>Крутний момент: {specs.combustionEngine?.torque} Нм</p>
//       <p>Витрата пального: {specs.combustionEngine?.fuelConsumption} л/100км</p>
//       <p>Коробка передач: {specs.combustionEngine?.transmission}</p>
//     </div>
//   ) : specs.fuelType === "гібрид" ? (
//     <div>
//       <p>Тип гібрида: {specs.hybrid?.hybridType}</p>
//       <p>Об'єм двигуна: {specs.hybrid?.engineDisplacement} л</p>
//       <p>Потужність електромотора: {specs.hybrid?.electricMotorPower} кВт</p>
//       <p>Загальна потужність: {specs.hybrid?.totalHorsepower} к.с.</p>
//       <p>Запас ходу на електро: {specs.hybrid?.electricRange} км</p>
//     </div>
//   ) : specs.fuelType === "електро" ? (
//     <div>
//       <p>Ємність батареї: {specs.electric?.batteryCapacity} кВт⋅год</p>
//       <p>Запас ходу: {specs.electric?.range} км</p>
//       <p>Потужність електромотора: {specs.electric?.electricMotorPower} кВт</p>
//       <p>Час зарядки: {specs.electric?.chargeTime}</p>
//       <p>Тип зарядного роз'єму: {specs.electric?.chargePort}</p>
//     </div>
//   ) : (
//     <p>Немає даних</p>
//   )}

//   {/* Виведення додаткових характеристик */}
//   <div>
//     <h3>Додаткові характеристики</h3>
//     {Object.keys(specs.additionalSpecs).length > 0 ? (
//       <ul>
//         {Object.entries(specs.additionalSpecs).map(([key, value]) => (
//           <li key={key}>
//             <strong>{key}:</strong> {value}
//           </li>
//         ))}
//       </ul>
//     ) : (
//       <p>Немає додаткових характеристик.</p>
//     )}
//   </div>

//   {/* Виведення корисних посилань */}
//   <div>
//     <h3>Корисні посилання</h3>
//     {specs.usefulLinks && specs.usefulLinks.length > 0 ? (
//       <ul>
//         {specs.usefulLinks.map((link, index) => (
//           <li key={index}>
//             <a href={link.url} target="_blank" rel="noopener noreferrer">
//               {link.title}
//             </a>
//           </li>
//         ))}
//       </ul>
//     ) : (
//       <p>Немає корисних посилань.</p>
//     )}
//   </div>
// </div>
