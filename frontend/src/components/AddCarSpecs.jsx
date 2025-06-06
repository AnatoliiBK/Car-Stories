import React, { useState, useRef, useEffect } from "react";
// import React, { useState } from "react";
import axios from "axios";
// import { url } from "../slices/api";
import { url, setHeaders } from "../slices/api";
import { useTheme } from "../components/ThemeContext";
import "./AddCarSpecs.css";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AddCarSpecsModal from "./AddCarSpecsModal";

const initialSpecs = {
  vin: "",
  source: "manual",
  fuelType: "",
  combustionEngine: {},
  hybrid: {},
  electric: {},
  nhtsaSpecs: {},
  additionalSpecs: {},
  usefulLinks: [],
};

const AddCarSpecs = ({ onSuccess, bypassPermissions = false }) => {
  const [car, setCar] = useState(null);
  const [specs, setSpecs] = useState(initialSpecs);
  const [message, setMessage] = useState("");
  const { theme } = useTheme();
  const userId = useSelector((state) => state.auth._id);
  const { carId } = useParams();
  const navigate = useNavigate();

  const [ownerId, setOwnerId] = useState(null);
  const isAdmin = useSelector((state) => state.auth.isAdmin); // додай в auth slice
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [showModal, setShowModal] = useState(false); // Стейт для показу модалки
  // const canEdit = userId === ownerId || isAdmin;
  const canEdit = bypassPermissions || userId === ownerId || isAdmin;

  console.log("car id in AddCarSpecs", carId);
  console.log("user id in AddCarSpecs", userId);

  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [newLink, setNewLink] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});
  const messageRef = useRef(null);

  // завантаження власника авто
  useEffect(() => {
    const fetchCarOwner = async () => {
      try {
        const res = await axios.get(`${url}/cars/${carId}`);
        setOwnerId(res.data.createdBy);
        setCar(res.data);
      } catch (err) {
        console.error("Помилка при отриманні власника авто:", err);
      }
    };
    fetchCarOwner();
  }, [carId]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [message]);

  const handleChange = (section, field, value) => {
    setSpecs((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFieldChange = (section) => (e) => {
    const { name, value, type } = e.target;
    handleChange(section, name, type === "number" ? +value : value);
  };

  const handleAddSpec = () => {
    const trimmedKey = newSpecKey.trim();
    const trimmedValue = newSpecValue.trim();
    if (!trimmedKey || !trimmedValue) return;
    if (specs.additionalSpecs.hasOwnProperty(trimmedKey)) {
      setMessage("⚠️ Така характеристика вже існує");
      return;
    }
    setSpecs((prev) => ({
      ...prev,
      additionalSpecs: {
        ...prev.additionalSpecs,
        [trimmedKey]: trimmedValue,
      },
    }));
    setNewSpecKey("");
    setNewSpecValue("");
  };

  const handleRemoveSpec = (key) => {
    setSpecs((prev) => {
      const updated = { ...prev.additionalSpecs };
      delete updated[key];
      return { ...prev, additionalSpecs: updated };
    });
  };

  const handleAddLink = () => {
    const trimmedLink = newLink.trim();
    if (!trimmedLink) return;
    if (!/^https?:\/\/.+/i.test(trimmedLink)) {
      setMessage("⚠️ Введіть правильне посилання (починається з http/https)");
      return;
    }
    if (specs.usefulLinks.includes(trimmedLink)) {
      setMessage("⚠️ Це посилання вже додано");
      return;
    }
    setSpecs((prev) => ({
      ...prev,
      usefulLinks: [...prev.usefulLinks, trimmedLink],
    }));
    setNewLink("");
  };

  const handleRemoveLink = (linkToRemove) => {
    setSpecs((prev) => ({
      ...prev,
      usefulLinks: prev.usefulLinks.filter((link) => link !== linkToRemove),
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post(`${url}/car-specs`, {
  //       carId,
  //       createdBy: userId,
  //       ...specs,
  //     }, setHeaders());
  //     setMessage("✅ Характеристики успішно додано");
  //     if (onSuccess) onSuccess(response.data);
  //     setSpecs(initialSpecs);
  //   } catch (error) {
  //     console.error("❌ Помилка:", error);
  //     setMessage("❌ Не вдалося зберегти характеристики");
  //   }
  // };

  const validateSpecs = (data) => {
    const errors = {};
    if (data.vin && data.vin.trim().length > 0 && data.vin.trim().length < 17)
      errors.vin = "VIN має містити щонайменше 17 символів.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateSpecs(specs);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setMessage("❌ Перевірте VIN.");
      return;
    }

    if (!carId || !userId) {
      console.error("❌ Відсутній carId або userId:", { carId, userId });
      setMessage("❌ Не вдалося зберегти: відсутній carId або userId");
      return;
    }

    const payload = {
      carId,
      createdBy: userId,
      ...specs,
    };

    if (!payload.vin || payload.vin.length < 17) {
      delete payload.vin;
    }

    try {
      const response = await axios.post(
        `${url}/car-specs`,
        payload,
        setHeaders()
      );
      setMessage("✅ Характеристики успішно додано");
      if (onSuccess) onSuccess(response.data);
      setSpecs(initialSpecs);
      setFieldErrors({});
    } catch (error) {
      console.error("❌ Помилка:", error);
      setMessage("❌ Не вдалося зберегти характеристики");
    }
  };

  return (
    <div className={`add-specs-container ${theme}`}>
      <h2>Додати технічні характеристики</h2>
      <p>{car?.brand} {car?.name} ({car?.year})</p>
      {/* {message && <p className="status-message">{message}</p>} */}

      <form className={`specs-form ${theme}`} onSubmit={handleSubmit}>
        {/* {userId !== ownerId && !isAdmin ? ( */}
        {!canEdit ? (
          <>
            <p className="warning">
              ❗️Лише власник авто або адміністратор може додавати
              характеристики.
            </p>
            {!permissionRequested ? (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await axios.post(
                      `${url}/car-specs/permission-request`,
                      {
                        carId,
                        // requesterId: userId,
                      },
                      setHeaders()
                    );
                    setMessage("📩 Запит на дозвіл надіслано власнику.");
                    setPermissionRequested(true);
                  } catch (err) {
                    console.error(err);
                    setMessage("❌ Не вдалося надіслати запит.");
                  }
                }}
              >
                Надіслати запит на дозвіл
              </button>
            ) : (
              <p className="info">📨 Запит надіслано.</p>
            )}
            <button className="back-button" onClick={() => navigate(-1)}>
              ← Назад
            </button>
          </>
        ) : // <button type="submit">Зберегти характеристики</button>
        null}

        {canEdit ? (
          <>
            <div
              className={`specs-button-wrapper ${theme}`}
              // onClick={() =>
              //   !canEdit ? navigate(`/car-specs/${carId}`) : setShowModal(true)
              // }
              onClick={() => setShowModal(true)}
            >
              <button type="button" className={`specs-button ${theme}`}>
                Спробувати обраним ресурсом
              </button>
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
            <label>
              VIN:
              <input
                value={specs.vin}
                onChange={(e) => setSpecs({ ...specs, vin: e.target.value })}
                maxLength={17}
                className={fieldErrors.vin ? "input-error" : ""}
              />
            </label>

            <label>
              Джерело:
              <select
                value={specs.source}
                onChange={(e) => setSpecs({ ...specs, source: e.target.value })}
              >
                <option value="manual">manual</option>
                <option value="auto-ria">auto-ria</option>
                <option value="AI">AI</option>
                <option value="bing">bing</option>
                <option value="msn">msn</option>
                <option value="gcs">gcs</option>
                <option value="algolia">algolia</option>
                <option value="nhtsa">nhtsa</option>
              </select>
            </label>

            <label>
              Тип двигуна:
              <select
                value={specs.fuelType}
                onChange={(e) =>
                  setSpecs({ ...specs, fuelType: e.target.value })
                }
              >
                <option value="">Оберіть...</option>
                <option value="бензин">Бензин</option>
                <option value="дизель">Дизель</option>
                <option value="гібрид">Гібрид</option>
                <option value="електро">Електро</option>
              </select>
            </label>

            {specs.fuelType === "бензин" || specs.fuelType === "дизель" ? (
              <>
                <h4>Двигун</h4>
                <label>Обʼєм (л):</label>
                <input
                  type="number"
                  name="engineDisplacement"
                  onChange={handleFieldChange("combustionEngine")}
                />
                <label>Потужність (к.с.):</label>
                <input
                  type="number"
                  name="horsepower"
                  onChange={handleFieldChange("combustionEngine")}
                />
                <label>Крутний момент (Нм):</label>
                <input
                  type="number"
                  name="torque"
                  onChange={handleFieldChange("combustionEngine")}
                />

                <label>Витрата пального (л/100 км):</label>
                <input
                  type="number"
                  name="fuelConsumption"
                  onChange={handleFieldChange("combustionEngine")}
                />

                <label>Коробка передач:</label>
                <input
                  type="text"
                  name="transmission"
                  onChange={handleFieldChange("combustionEngine")}
                />
              </>
            ) : specs.fuelType === "гібрид" ? (
              <>
                <h4>Гібридний двигун</h4>
                <label>Тип:</label>
                <input
                  type="text"
                  name="type"
                  onChange={handleFieldChange("hybrid")}
                />

                <label>Об'єм двигуна (л):</label>
                <input
                  type="number"
                  name="engineDisplacement"
                  onChange={handleFieldChange("hybrid")}
                />

                <label>Витрата пального (л/100 км):</label>
                <input
                  type="number"
                  name="fuelConsumption"
                  onChange={handleFieldChange("hybrid")}
                />

                <label>Потужність електромотора (кВт):</label>
                <input
                  type="number"
                  name="electricMotorPower"
                  onChange={handleFieldChange("hybrid")}
                />

                <label>Загальна потужність (к.с.):</label>
                <input
                  type="number"
                  name="totalHorsepower"
                  onChange={handleFieldChange("hybrid")}
                />

                <label>Запас ходу на електро (км):</label>
                <input
                  type="number"
                  name="electricRange"
                  onChange={handleFieldChange("hybrid")}
                />
              </>
            ) : specs.fuelType === "електро" ? (
              <>
                <h4>Електродвигун</h4>

                <label>Ємність батареї (кВт⋅год):</label>
                <input
                  type="number"
                  name="batteryCapacity"
                  onChange={handleFieldChange("electric")}
                />

                <label>Запас ходу (км):</label>
                <input
                  type="number"
                  name="range"
                  onChange={handleFieldChange("electric")}
                />

                <label>Потужність електротяги (кВт):</label>
                <input
                  type="number"
                  name="electricMotorPower"
                  onChange={handleFieldChange("electric")}
                />

                <label>Час зарядки:</label>
                <input
                  type="text"
                  name="chargeTime"
                  onChange={handleFieldChange("electric")}
                />

                <label>Тип зарядного роз'єму:</label>
                <input
                  type="text"
                  name="chargePort"
                  onChange={handleFieldChange("electric")}
                />
              </>
            ) : null}

            {/* 🔧 Можна додати додаткові характеристики, посилання тощо */}
            <div className="additional-specs-section">
              <h4>🔧 Додаткові характеристики</h4>
              <div className="add-spec-row">
                <input
                  type="text"
                  placeholder="Назва"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Значення"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                />
                <button
                  type="button"
                  className="add-button"
                  onClick={handleAddSpec}
                >
                  ➕
                </button>
              </div>
              <ul className="animated-list">
                {Object.entries(specs.additionalSpecs).map(([key, value]) => (
                  <li key={key} className="fade-in">
                    <strong>{key}:</strong> {value}
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => handleRemoveSpec(key)}
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="useful-links-section">
              <h4>🔗 Корисні посилання</h4>
              <div className="add-link-row">
                <input
                  type="text"
                  placeholder="https://..."
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                />
                <button
                  type="button"
                  className="add-button"
                  onClick={handleAddLink}
                >
                  ➕
                </button>
              </div>
              <ul className="animated-list">
                {specs.usefulLinks.map((link) => (
                  <li key={link} className="fade-in">
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => handleRemoveLink(link)}
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* {message && <p className="status-message">{message}</p>} */}
            {message && (
              <div className="message fade-in" ref={messageRef}>
                {message}
              </div>
            )}

            <div className="buttons">
              <button className="back-button" onClick={() => navigate(-1)}>
                ← Назад
              </button>
              {/* <button className="save-button" onClick={handleSubmit}>
          💾 Зберегти
        </button> */}
            </div>

            <button type="submit" className="submit-button">
              💾 Зберегти
            </button>
          </>
        ) : null}
      </form>
    </div>
  );
};

export default AddCarSpecs;

// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { url } from "../slices/api";
// import "./AddCarSpecs.css"
// import { useTheme } from "../components/ThemeContext";

// const AddCarSpecs = () => {
//   const { carId } = useParams();
//   const navigate = useNavigate();
//   const [fuelType, setFuelType] = useState("бензин");
//   const [specs, setSpecs] = useState({});
//   const { theme } = useTheme();

//   const handleChange = (e) => {
//     setSpecs({ ...specs, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${url}/car-specs`, { carId, fuelType, ...specs });
//       navigate(`/cars/${carId}`); // Повертаємо користувача до авто
//     } catch (error) {
//       console.error("Помилка додавання характеристик:", error);
//     }
//   };

//   return (
//     <div className="add-specs-container">
//       <h2>Додати характеристики авто</h2>
//       <form className={`specs-form ${theme}`} onSubmit={handleSubmit}>
//         <label>Тип двигуна:</label>
//         <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
//           <option value="бензин">Бензин</option>
//           <option value="дизель">Дизель</option>
//           <option value="гібрид">Гібрид</option>
//           <option value="електро">Електро</option>
//         </select>

//         {fuelType === "бензин" || fuelType === "дизель" ? (
//           <>
//             <label>Об'єм двигуна (л):</label>
//             <input type="number" name="engineDisplacement"  step="0.01" onChange={handleChange} />

//             <label>Потужність (к.с.):</label>
//             <input type="number" name="horsepower" onChange={handleChange} />

//             <label>Крутний момент (Нм):</label>
//             <input type="number" name="torque" onChange={handleChange} />

//             <label>Витрата пального (л/100 км):</label>
//             <input type="number" name="fuelConsumption" onChange={handleChange} />

//             <label>Коробка передач:</label>
//             <input type="text" name="transmission" onChange={handleChange} />
//           </>
//         ) : fuelType === "гібрид" ? (
//           <>
//             <label>Тип гібрида:</label>
//             <input type="text" name="hybridType" onChange={handleChange} />

//             <label>Об'єм двигуна (л):</label>
//             <input type="number" name="engineDisplacement" onChange={handleChange} />

//             <label>Потужність електромотора (кВт):</label>
//             <input type="number" name="electricMotorPower" onChange={handleChange} />

//             <label>Загальна потужність (к.с.):</label>
//             <input type="number" name="totalHorsepower" onChange={handleChange} />

//             <label>Запас ходу на електро (км):</label>
//             <input type="number" name="electricRange" onChange={handleChange} />
//           </>
//         ) : (
//           <>
//             <label>Ємність батареї (кВт⋅год):</label>
//             <input type="number" name="batteryCapacity" onChange={handleChange} />

//             <label>Запас ходу (км):</label>
//             <input type="number" name="range" onChange={handleChange} />

//             <label>Потужність електромотора (кВт):</label>
//             <input type="number" name="electricMotorPower" onChange={handleChange} />

//             <label>Час зарядки:</label>
//             <input type="text" name="chargeTime" onChange={handleChange} />

//             <label>Тип зарядного роз'єму:</label>
//             <input type="text" name="chargePort" onChange={handleChange} />
//           </>
//         )}

//         <button className="add-specs-button" type="submit">Зберегти</button>
//       </form>
//     </div>
//   );
// };

// export default AddCarSpecs;
