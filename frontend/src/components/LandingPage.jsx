import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./LandingPage.css";
import { FaVolumeMute } from "react-icons/fa";
import mb from "../cars/Mercedes Benz S-Class Electric Coupe 10.png";
import carSound from "../sounds/Alarm off & on.mp3";
import { useTheme } from "../components/ThemeContext";
import { jwtDecode } from "jwt-decode";

const LandingPage = () => {
  const audioRef = useRef(null);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const handleUserInteraction = () => {
    setIsUserInteracted(true);
  };

  const handleMouseEnter = () => {
    if (isUserInteracted && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => console.error("Play error:", error));
    }
  };

  const handleMouseLeave = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleImageClick = () => {
    const token = auth.token;

    if (token && token.split(".").length === 3) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?._id) {
          // Користувач валідний
          navigate("/cars");
        } else {
          navigate("/register");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/register");
      }
    } else {
      // Токену немає або він кривий
      navigate("/login");
    }
  };

  return (
    <div className={`landing-page ${theme}`}>
      {!isUserInteracted && (
        <div className="sound-notice" onClick={handleUserInteraction}>
          <FaVolumeMute className="sound-icon" />
          <p>Натисніть, щоб увімкнути звук</p>
        </div>
      )}

      <div className="landing-content">
        <div className="landing-images">
          <img
            src={mb}
            alt="Спортивний автомобіль"
            className="sports-car"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleImageClick} // 👈 головна зміна тут
            style={{ cursor: "pointer" }}
          />
        </div>
        <audio ref={audioRef} src={carSound} muted={!isUserInteracted}></audio>
      </div>
    </div>
  );
};

export default LandingPage;


// import React, { useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import "./LandingPage.css";
// import { FaVolumeMute, FaVolumeUp } from "react-icons/fa"; // Іконки гучності
// import mb from "../cars/Mercedes Benz S-Class Electric Coupe 10.png";
// import carSound from "../sounds/Alarm off & on.mp3";
// import { useTheme } from "../components/ThemeContext";

// const LandingPage = () => {
//   const audioRef = useRef(null);
//   const [isUserInteracted, setIsUserInteracted] = useState(false);
//   const { theme } = useTheme();

//   const handleUserInteraction = () => {
//     setIsUserInteracted(true);
//   };

//   const handleMouseEnter = () => {
//     if (isUserInteracted && audioRef.current) {
//       audioRef.current.currentTime = 0;
//       audioRef.current.play().catch((error) => console.error("Play error:", error));
//     }
//   };

//   const handleMouseLeave = () => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//     }
//   };

//   return (
//     <div className={`landing-page ${theme}`}>
//       {/* Іконка натискання для активації звуку */}
//       {!isUserInteracted && (
//         <div className="sound-notice" onClick={handleUserInteraction}>
//           <FaVolumeMute className="sound-icon" />
//           <p>Натисніть, щоб увімкнути звук</p>
//         </div>
//       )}

//       <div className="landing-content">
//         <div className="landing-images">
//           <Link to="/cars" className="car-link">
//             <img
//               src={mb}
//               alt="Спортивний автомобіль"
//               className="sports-car"
//               onMouseEnter={handleMouseEnter}
//               onMouseLeave={handleMouseLeave}
//             />
//           </Link>
//         </div>
//         <audio ref={audioRef} src={carSound} muted={!isUserInteracted}></audio>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;


// import React from "react";
// import { Link } from "react-router-dom";
// import "./LandingPage.css";
// import mb from "../cars/Mercedes Benz S-Class Electric Coupe 4.png"
// import bu from "../cars/Bugatti Type 41 Royale  1927.jpg"

// const LandingPage = () => {
//   return (
//     <div className="landing-page">
//       <div className="landing-content">
//         <div className="landing-images">
//           <Link to="/cars" className="car-link">
//             <img
//               src={mb}
//               alt="Спортивний автомобіль"
//               className=" sports-car"
//             />
//           </Link>
//           {/* <Link to="/cars" className="car-link">
//             <img
//               src={bu}
//               alt="Класичний автомобіль"
//               className="car-image classic-car"
//             />
//           </Link> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;



// import React from "react";
// import { Link } from "react-router-dom";
// import './LandingPage.css'; // Стилі для гарного вигляду

// const LandingPage = () => {
//   return (
//     <div className="landing-page">
//       <div className="landing-content">
//         {/* <h1>Welcome to Car Stories</h1>
//         <p>Explore the best products and enjoy great services.</p> */}
//         <div className="landing-buttons">
//           <Link to="/cars" className="btn">Автомобілі світу</Link>
//           {/* <Link to="/details" className="btn">View Details</Link> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;
