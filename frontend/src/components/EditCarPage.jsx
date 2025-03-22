import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditCarForm from "../components/EditCarForm";
import "./EditCarPage.css"

const EditCarPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(true); // ✅ Контролюємо стан форми
  
    // ✅ Закриває форму при натисканні поза нею або кнопкою "✖"
  const handleClose = () => {
    setIsEditing(false);
      // navigate(`/cars/${id}`); // ✅ Повертаємось на картку автомобіля
      navigate(-1);
  };

  // ✅ Виконується при успішному оновленні
    const handleSuccess = () => {
    setIsEditing(false); // ✅ Закриваємо форму
    // navigate(`/cars/${id}`); // ✅ Перенаправлення назад
  };

  return (
      <div className="edit-car-page">
          <button className="back-btn" onClick={() => navigate("/cars")}>
        ⬅ Назад до списку авто
      </button>
          {/* <EditCarForm carId={id} onSuccess={handleSuccess} /> */}
          {isEditing && <EditCarForm carId={id} onSuccess={handleSuccess} onClose={handleClose} />}
    </div>
  );
};

export default EditCarPage;
