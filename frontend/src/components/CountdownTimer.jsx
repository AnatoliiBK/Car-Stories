import React, { useEffect, useState } from "react";
import "./CountdownTimer.css";

const CountdownTimer = ({ createdAt }) => {
  const hours = 0;
  const minutes = 20;
  const totalDuration = (hours * 60 + minutes) * 60 * 1000;
  // const totalDuration = 1 * 60 * 60 * 1000; // 24 години в мілісекундах
  const [timeLeft, setTimeLeft] = useState(getRemainingTime(createdAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getRemainingTime(createdAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  function getRemainingTime(startTime) {
    const elapsed = Date.now() - new Date(startTime).getTime();
    const remaining = Math.max(totalDuration - elapsed, 0);
    const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return {
      hours,
      minutes,
      seconds,
      remaining,
      progressPercent,
    };
  }

  const isExpired =
    timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="countdown-wrapper">
      <span className={`countdown ${isExpired ? "expired" : ""}`}>
        {isExpired ? (
          <>⏱ Час вичерпано</>
        ) : (
          <>
            ⏳ Залишилось:{" "}
            <span className="animated">
              {`${String(timeLeft.hours).padStart(2, "0")}:${String(
                timeLeft.minutes
              ).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`}
            </span>
          </>
        )}
      </span>

      {/* Прогрес-бар */}
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${timeLeft.progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CountdownTimer;

// import React, { useEffect, useState } from "react";

// const CountdownTimer = ({ createdAt }) => {
//   const [timeLeft, setTimeLeft] = useState(getRemainingTime(createdAt));

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimeLeft(getRemainingTime(createdAt));
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [createdAt]);

//   function getRemainingTime(startTime) {
//     const total = 24 * 60 * 60 * 1000; // 24 години
//     const elapsed = Date.now() - new Date(startTime).getTime();
//     const remaining = Math.max(total - elapsed, 0);

//     const hours = Math.floor(remaining / (1000 * 60 * 60));
//     const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

//     return { hours, minutes, seconds };
//   }

//   return (
//     <span className="countdown">
//       ⏳ Залишилось:{" "}
//       {`${String(timeLeft.hours).padStart(2, "0")}:${String(
//         timeLeft.minutes
//       ).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`}
//     </span>
//   );
// };

// export default CountdownTimer;
