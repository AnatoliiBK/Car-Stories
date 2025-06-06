import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { url, setHeaders } from "../slices/api";
import { motion, AnimatePresence } from "framer-motion";
import "./PermissionResponsePage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const socket = io(url);

const PermissionResponsePage = () => {
  const auth = useSelector((state) => state.auth);
  const [responses, setResponses] = useState([]);
  const navigate = useNavigate();

  console.log("AUTH IN RES PAGE", auth);

  useEffect(() => {
    if (!auth._id) return;
    const fetchResponses = async () => {
      try {
        const res = await axios.get(
          `${url}/car-specs/permission-responses`,
          setHeaders()
        );
        console.log("RES IN RES PAGE : ", res.data.responses);
        setResponses(res.data.responses);
      } catch (err) {
        console.error("Помилка при завантаженні відповідей:", err);
      }
    };

    fetchResponses();

    socket.emit("join", auth._id);

    const handleResponse = (data) => {
      if (!data || !data.userId) {
        console.warn("Отримано некоректні дані:", data);
        return;
      }
      if (String(data.userId) === String(auth._id)) {
        // const newResponse = { ...data, timestamp: Date.now() };
        const newResponse = {
          ...data,
          createdAt: data.createdAt || new Date().toISOString(),
          timestamp: Date.now(),
        };
        console.log("📬 Отримано дату:", newResponse);
        console.log("📬 Отримано повідомлення:", data);
        console.log("🧾 Мій ID:", auth._id);
        setResponses((prev) => [newResponse, ...prev]);
        console.log("DATA USER ID", data.userId);
        // автоочищення через 15 сек
        setTimeout(() => {
          setResponses((prev) =>
            prev.filter(
              (r) =>
                // String(new Date(r.createdAt).getTime()) !==
              // String(new Date(newResponse.createdAt).getTime())
              prev.filter((r) => r.timestamp !== newResponse.timestamp)
            )
          );
        }, 15000);
        // setTimeout(() => {
        //   setResponses((prev) =>
        //     prev.filter((r) => r.timestamp !== newResponse.timestamp)
        //   );
        // }, 15000);
      }
    };
    console.log("✅ Підключення до WebSocket, auth._id:", auth._id);
    socket.on("permission-request-updated", handleResponse);

    return () => {
      socket.off("permission-request-updated", handleResponse);
    };
  }, [auth._id]);

  const handleDeleteResponse = async (id) => {
    try {
      const res = await fetch(`${url}/car-specs/response/${id}`, {
        method: "DELETE",
        headers: {
          ...setHeaders().headers,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete");

      setResponses((prev) => prev.filter((r) => r._id !== id));

      socket.emit("permission-response-deleted", { userId: auth._id });
    } catch (err) {
      console.error("❌ Не вдалося видалити відповідь:", err);
    }
  };

  //   const clearAll = () => setResponses([]);
  const clearAll = async () => {
    const confirmClear = window.confirm("Очистити всі сповіщення?");
    if (!confirmClear) return;

    try {
      const response = await fetch(`${url}/car-specs/clear-responses`, {
        method: "DELETE",
        headers: {
          ...setHeaders().headers,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Помилка при очищенні");

      setResponses([]);
    } catch (err) {
      console.error("❌ Не вдалося очистити відповіді:", err);
      alert("Не вдалося очистити відповіді");
    }
  };

  return (
    <div className="permission-response-page">
      <div className="response-header">
        <h2>Відповіді на ваші запити</h2>
        {responses.length > 0 && (
          <button className="clear-btn" onClick={clearAll}>
            Очистити всі
          </button>
        )}
      </div>
      <AnimatePresence>
        {responses.map((resp) => (
          <motion.div
            key={resp.timestamp}
            className={`response-card ${
              resp.approved ? "approved" : "rejected"
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <p>
              <strong>
                {resp.carBrand} {resp.carName} ({resp.carYear})
              </strong>{" "}
              — {resp.approved ? "✅ підтверджено" : "❌ відхилено"}
            </p>
            <small>
              {new Date(resp.timestamp).toLocaleTimeString()} — нове сповіщення
            </small>
            <div className="response-actions">
              {resp.approved && (
                <button
                  className="go-add-specs-btn"
                  // onClick={() => navigate(`/add-car-specs/${resp.carId}`)}
                  onClick={() => navigate(`/car-specs/add-by-request/${resp.carId}`, { state: { allowed: true } })
                }
                >
                  ➕ Додати характеристики
                </button>
              )}
              <button
                className="delete-btn"
                onClick={() => handleDeleteResponse(resp._id)}
                title="Видалити повідомленн"
              >
                ❌
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {responses.length === 0 && <p>Наразі немає нових відповідей.</p>}
    </div>
  );
};

export default PermissionResponsePage;
