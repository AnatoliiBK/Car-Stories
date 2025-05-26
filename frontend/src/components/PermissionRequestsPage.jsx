import React, { useEffect, useState } from "react";
import axios from "axios";
import { url, setHeaders } from "../slices/api";
import { io } from "socket.io-client";
import CountdownTimer from "./CountdownTimer";

// const socket = io(url);

const PermissionRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `${url}/car-specs/permission-requests`,
        setHeaders()
      );
      console.log("FETCH ALL REQUESTS LIST : ", res.data)
      // setRequests(res.data);
      setRequests(res.data.requests)
    } catch (error) {
      console.error("Помилка завантаження запитів:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (id, approved) => {
    try {
      const res = await axios.patch(
        `${url}/car-specs/permission-request/${id}`,
        { approved },
        setHeaders()
      );
  
      // 🔄 Локально оновлюємо стан після успішної відповіді
      const updatedRequest = res.data.request;
      setRequests((prev) =>
        prev.map((req) =>
          req._id === updatedRequest._id ? { ...req, approved: updatedRequest.approved } : req
        )
      );
  
      alert(approved ? "Автомобіль затверджено" : "Запит відхилено");
    } catch (error) {
      console.error("Помилка відповіді на запит:", error);
    }
  };
  
    
    useEffect(() => {
        fetchRequests();
    }, [])



  if (loading) return <div>Завантаження...</div>;

  return (
    <div className="permission-requests-page">
      <h2>Запити на дозвіл</h2>
      {requests.length === 0 ? (
        <p>Запитів немає.</p>
      ) : (
          requests.map((req) => (
            <div key={req._id} className="request-card">
              <p>
                <strong>{req.requesterId.name}</strong> просить дозволу додати
                характеристики до авто:{" "}
                <strong>
                  {req.carId.brand} {req.carId.name} ({req.carId.year})
                </strong>
              </p>
          
              {/* Статус — 3 варіанти */}
              <p>
                Статус:{" "}
                {/* {req.approved === true
                  ? "✅ Підтверджено"
                  : req.approved === false
                  ? "❌ Відхилено"
                  : "🕒 Очікує"} */}
                {req.approved === true ? (
    <span className="status approved">
      ✅ Схвалено <CountdownTimer createdAt={req.updatedAt} />
    </span>
  ) : req.approved === false ? (
    <span className="status rejected">❌ Відхилено</span>
  ) : (
    <span className="status pending">🕒 Очікує</span>
  )}
              </p>
          
              {/* Кнопки тільки якщо ще не підтверджено і не відхилено */}
              {req.approved === null || req.approved === undefined ? (
                <div>
                  <button onClick={() => handleResponse(req._id, true)}>
                    ✅ Дозволити
                  </button>
                  <button onClick={() => handleResponse(req._id, false)}>
                    ❌ Відхилити
                  </button>
                </div>
              ) : (
                <p style={{ color: "gray" }}>Запит вже опрацьовано</p>
              )}
            </div>
          ))
          
      )}
    </div>
  );
};

export default PermissionRequestsPage;
