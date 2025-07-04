import React, { useEffect, useState } from "react";
import axios from "axios";
import { url, setHeaders } from "../slices/api";
import { io } from "socket.io-client";
import CountdownTimer from "./CountdownTimer";
import { useSelector } from "react-redux";
import "./PermissionRequestsPage.css";
import { useTheme } from "../components/ThemeContext";


const socket = io(url);
// // 🔌 Ініціалізуємо socket
// const socket = io(url, { transports: ["websocket"] });

const PermissionRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.auth._id); // ← напряму з Redux
  const { theme } = useTheme();

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `${url}/car-specs/permission-requests`,
        setHeaders()
      );
      // const res = await axios.post(
      //   `${url}/car-specs/permission-requests`,
      //   { knownRequestIds: requests.map((r) => r._id) },
      //   setHeaders()
      // );
      
      console.log("FETCH ALL REQUESTS LIST : ", res.data);
      // setRequests(res.data);
      setRequests(res.data.requests);
    } catch (error) {
      console.error("Помилка завантаження запитів:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Дозвіл / Відхилення
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
          req._id === updatedRequest._id
            ? { ...req, approved: updatedRequest.approved, updatedAt: new Date().toISOString(), }
            : req
        )
      );

      alert(approved ? "Автомобіль затверджено" : "Запит відхилено");
    } catch (error) {
      console.error("Помилка відповіді на запит:", error);
    }
  };

  useEffect(() => {
    fetchRequests();

    if (!userId) return;

    socket.emit("join", userId); // Приєднання до кімнати

    const handleNewPermissionRequest = (data) => {
      console.log("📬 Подія надійшла:", data);
      fetchRequests(); // Повторно отримуємо всі запити
    };

    // const handleExpiredRequests = (data) => {
    //   console.log("🧹 Видаляємо застарілі запити:", data);
    //   const { expiredRequestIds } = data;
    //   setRequests((prev) =>
    //     prev.filter((req) => !expiredRequestIds.includes(req._id))
    //   );
    // };
    const handleExpiredRequests = (data) => {
      console.log("🧹 Видалено:", data.expiredRequestIds);
      setRequests((prev) =>
        prev.filter((req) => !data.expiredRequestIds.includes(req._id))
      );
    };

    socket.on("permission-request-added", handleNewPermissionRequest);
    socket.on("permission-requests-expired", handleExpiredRequests);

    return () => {
      socket.off("permission-request-added", handleNewPermissionRequest);
      socket.off("permission-requests-expired", handleExpiredRequests);
    };
  }, [userId]);

  if (loading) return <div>Завантаження...</div>;

  return (
    <div className="permission-requests-page">
      <h2 className="page-title">Запити на дозвіл</h2>
      {requests.length === 0 ? (
        <p className="no-requests">Запитів немає.</p>
      ) : (
        <div className="requests-container">
          {requests.map((req) => (
            <div key={req._id} className="request-card">
              <p className="request-text">
                <strong>{req.requesterId.name}</strong> просить дозволу додати характеристики до авто:{" "}
                <strong>
                  {req.carId.brand} {req.carId.name} ({req.carId.year})
                </strong>
              </p>
  
              <p className="request-status">
                Статус:{" "}
                {req.approved === true ? (
                  <span className={`status approved ${theme}`}>
                    ✅ Схвалено <CountdownTimer createdAt={req.updatedAt} />
                  </span>
                ) : req.approved === false ? (
                  <span className={`status rejected ${theme}`}>❌ Відхилено</span>
                ) : (
                  <span className={`status pending ${theme}`}>🕒 Очікує</span>
                )}
              </p>
  
              {req.approved === null || req.approved === undefined ? (
                <div className="request-actions">
                  <button className={`btn approve ${theme}`} onClick={() => handleResponse(req._id, true)}>
                    ✅ Дозволити
                  </button>
                  <button className={`btn reject ${theme}`} onClick={() => handleResponse(req._id, false)}>
                    ❌ Відхилити
                  </button>
                </div>
              ) : (
                <p className="already-processed">Запит вже опрацьовано</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default PermissionRequestsPage;
