import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { url, setHeaders } from "../slices/api";
import { useTheme } from "../components/ThemeContext";
import { useSelector } from "react-redux";
import "./EditCarSpecsPage.css";

const EditCarSpecsPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const currentUser = useSelector((state) => state.auth);

  const [specs, setSpecs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        const { data } = await axios.get(`${url}/car-specs/${carId}`);
        setSpecs(data);
      } catch (error) {
        console.error("❌ Не вдалося завантажити характеристики:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecs();
  }, [carId]);

  const handleChange = (section, field, value) => {
    setSpecs((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleAdditionalChange = (key, value) => {
    setSpecs((prev) => ({
      ...prev,
      additionalSpecs: {
        ...prev.additionalSpecs,
        [key]: value,
      },
    }));
  };

  const addAdditionalSpec = () => {
    setSpecs((prev) => ({
      ...prev,
      additionalSpecs: {
        ...prev.additionalSpecs,
        "": "",
      },
    }));
  };

  const removeAdditionalSpec = (key) => {
    const updated = { ...specs.additionalSpecs };
    delete updated[key];
    setSpecs((prev) => ({
      ...prev,
      additionalSpecs: updated,
    }));
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...specs.usefulLinks];
    updatedLinks[index][field] = value;
    setSpecs((prev) => ({ ...prev, usefulLinks: updatedLinks }));
  };

  const addLink = () => {
    setSpecs((prev) => ({
      ...prev,
      usefulLinks: [...(prev.usefulLinks || []), { title: "", url: "" }],
    }));
  };

  const removeLink = (index) => {
    const updatedLinks = [...specs.usefulLinks];
    updatedLinks.splice(index, 1);
    setSpecs((prev) => ({ ...prev, usefulLinks: updatedLinks }));
  };

  const validate = () => {
    const newErrors = {};
    if (!specs.fuelType) newErrors.fuelType = "Оберіть тип палива";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
        //   const token = localStorage.getItem("token");
        console.log("🛠️ ID:", specs._id);

      await axios.put(`${url}/car-specs/${specs._id}`, specs, setHeaders());
      setMessage("✅ Характеристики оновлено!");
    } catch (error) {
      console.error("❌ Помилка оновлення:", error);
      setMessage("❌ Не вдалося оновити характеристики.");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Ви впевнені, що хочете видалити характеристики?");
    if (!confirmed) return;

    try {
    //   const token = localStorage.getItem("token");
      await axios.delete(`${url}/car-specs/${specs._id}`, setHeaders());
      navigate(-1);
    } catch (error) {
      console.error("❌ Не вдалося видалити:", error);
      setMessage("❌ Помилка видалення.");
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (!specs) return <p>Характеристики не знайдено</p>;

  const isOwnerOrAdmin =
    currentUser &&
    (currentUser._id === specs.createdBy._id || currentUser.isAdmin === true);

  if (!isOwnerOrAdmin) {
    return <p>⛔ У вас немає доступу до редагування цих характеристик.</p>;
  }

  return (
    <div className={`edit-specs-container ${theme}`}>
      <h2>Редагування характеристик</h2>

      <label>
        Тип палива:
        <select
          value={specs.fuelType}
          onChange={(e) => setSpecs({ ...specs, fuelType: e.target.value })}
          className={`area-specs ${theme}`}
        >
          <option className={`option ${theme}`} value="">Оберіть</option>
          <option className={`option ${theme}`} value="бензин">Бензин</option>
          <option className={`option ${theme}`} value="дизель">Дизель</option>
          <option className={`option ${theme}`} value="гібрид">Гібрид</option>
          <option className={`option ${theme}`} value="електро">Електро</option>
        </select>
        {errors.fuelType && <span className="error">{errors.fuelType}</span>}
      </label>

      {specs.fuelType === "бензин" || specs.fuelType === "дизель" ? (
  <>
    <label>
      Об'єм двигуна:
      <input
        value={specs.combustionEngine?.engineDisplacement || ""}
        onChange={(e) =>
          handleChange("combustionEngine", "engineDisplacement", e.target.value)
        }
        className={`area-specs ${theme}`}
      />
    </label>
    <label>
      Потужність:
      <input
        value={specs.combustionEngine?.horsepower || ""}
        onChange={(e) =>
          handleChange("combustionEngine", "horsepower", e.target.value)
        }
        className={`area-specs ${theme}`}                  
      />
    </label>
    <label>
      Крутний момент:
      <input
        value={specs.combustionEngine?.torque || ""}
        onChange={(e) =>
          handleChange("combustionEngine", "torque", e.target.value)
        }
        className={`area-specs ${theme}`}                  
      />
    </label>
    <label>
      Витрата пального:
      <input
        value={specs.combustionEngine?.fuelConsumption || ""}
        onChange={(e) =>
          handleChange("combustionEngine", "fuelConsumption", e.target.value)
        }
        className={`area-specs ${theme}`}                  
      />
    </label>
    <label>
      Коробка передач:
      <input
        value={specs.combustionEngine?.transmission || ""}
        onChange={(e) =>
          handleChange("combustionEngine", "transmission", e.target.value)
        }
        className={`area-specs ${theme}`}                  
      />
    </label>
  </>
) : specs.fuelType === "гібрид" ? (
  <>
    <label>
      Тип гібрида:
      <input
        value={specs.hybrid?.hybridType || ""}
        onChange={(e) => handleChange("hybrid", "hybridType", e.target.value)}
        className={`area-specs ${theme}`}
      />
    </label>
    <label>
      Об'єм двигуна:
      <input
        value={specs.hybrid?.engineDisplacement || ""}
        onChange={(e) => handleChange("hybrid", "engineDisplacement", e.target.value)}
        className={`area-specs ${theme}`}
      />
    </label>
    <label>
      Потужність електродвигуна:
      <input
        value={specs.hybrid?.electricMotorPower || ""}
        onChange={(e) => handleChange("hybrid", "electricMotorPower", e.target.value)}
        className={`area-specs ${theme}`}
      />
    </label>
    <label>
      Загальна потужність:
      <input
        value={specs.hybrid?.totalHorsepower || ""}
        onChange={(e) => handleChange("hybrid", "totalHorsepower", e.target.value)}
        className={`area-specs ${theme}`}
      />
    </label>
    <label>
      Дальність на електриці:
      <input
        value={specs.hybrid?.electricRange || ""}
        onChange={(e) => handleChange("hybrid", "electricRange", e.target.value)}
        className={`area-specs ${theme}`}
      />
    </label>
  </>
) : specs.fuelType === "електро" ? (
  <>
    <label>
      Ємність батареї:
      <input
        value={specs.electric?.batteryCapacity || ""}
        onChange={(e) => handleChange("electric", "batteryCapacity", e.target.value)}
        className={`area-specs ${theme}`}
      />
    </label>
    <label>
      Дальність ходу:
      <input
        value={specs.electric?.range || ""}
        onChange={(e) => handleChange("electric", "range", e.target.value)}
        className={`area-specs ${theme}`}
      />
    </label>
    <label>
      Потужність електродвигуна:
      <input
        value={specs.electric?.electricMotorPower || ""}
        onChange={(e) => handleChange("electric", "electricMotorPower", e.target.value)}
        className={`area-specs ${theme}`}
      />
    </label>
    <label>
      Час зарядки:
      <input
        value={specs.electric?.chargeTime || ""}
        onChange={(e) => handleChange("electric", "chargeTime", e.target.value)}
        className={`area-specs ${theme}`}
      />
    </label>
    <label>
      Роз’єм для зарядки:
      <input
        value={specs.electric?.chargePort || ""}
        onChange={(e) => handleChange("electric", "chargePort", e.target.value)}
        className={`area-specs ${theme}`}
      />
    </label>
  </>
) : null}


      <div className="section">
        <h3>Додаткові характеристики</h3>
        {specs.additionalSpecs &&
          Object.entries(specs.additionalSpecs).map(([key, value]) => (
            <div key={key} className={`additional-input ${theme}`}>
              <input
                placeholder="Назва"
                value={key}
                onChange={(e) => {
                  const newKey = e.target.value;
                  const newValue = specs.additionalSpecs[key];
                  const updated = { ...specs.additionalSpecs };
                  delete updated[key];
                  updated[newKey] = newValue;
                  setSpecs({ ...specs, additionalSpecs: updated });
                }}
                className={`area-specs ${theme}`}
                autoFocus
              />
              <input
                placeholder="Значення"
                value={value}
                onChange={(e) => handleAdditionalChange(key, e.target.value)}
                className={`area-specs ${theme}`}
              />
              <button className="delete-button" onClick={() => removeAdditionalSpec(key)}>🗑️</button>
            </div>
          ))}
        <button className="add-addit-specs-button" onClick={addAdditionalSpec}>➕ Додати характеристику</button>
      </div>

      <div className="section">
        <h3>Корисні посилання</h3>
        {(specs.usefulLinks || []).map((link, index) => (
          <div key={index} className="link-input">
            <input
              placeholder="Заголовок"
              value={link.title}
              onChange={(e) => handleLinkChange(index, "title", e.target.value)}
              className={`area-specs ${theme}`}
            />
            <input
              placeholder="URL"
              value={link.url}
              onChange={(e) => handleLinkChange(index, "url", e.target.value)}
              className={`area-specs ${theme}`}
            />
            <button className="delete-button" onClick={() => removeLink(index)}>🗑️</button>
          </div>
        ))}
        <button className="add-addit-specs-button" onClick={addLink}>➕ Додати посилання</button>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="buttons">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <button className="save-button" onClick={handleSubmit}>
          💾 Зберегти
        </button>
        <button className="delete-button" onClick={handleDelete}>
          🗑️ Видалити характеристики
        </button>
      </div>
    </div>
  );
};

export default EditCarSpecsPage;
