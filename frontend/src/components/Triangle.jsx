import React from 'react';
import './Triangle.css';

const Triangle = ({ onToggle, isOpen }) => {
  return (
    <div className="triangle-inl-container">
      <div
        className={`triangle-inl-toggle ${isOpen ? 'rotated' : ''}`}
        onClick={onToggle}
      />
    </div>
  );
};

export default Triangle;


// import React, { useRef, useState, useEffect } from 'react';
// import './Triangle.css';

// const Triangle = ({ onToggle }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [spinOnce, setSpinOnce] = useState(true);
//   const toggleRef = useRef(null);

//   useEffect(() => {
//     const timer = setTimeout(() => setSpinOnce(false), 1000); // через 1с вимикаємо клас
//     return () => clearTimeout(timer);
//   }, []);

//   const handleToggle = () => {
//     setIsOpen((prev) => !prev);
//     if (onToggle) onToggle(!isOpen); // Викликаємо зовнішню функцію
//   };

//   return (
//     <div className="triangle-inl-container">
//       <div
//         ref={toggleRef}
//         className={`triangle-inl-toggle ${isOpen ? 'rotated' : ''} ${spinOnce ? 'spin-once' : ''}`}
//         onClick={handleToggle}
//       />
//     </div>
//   );
// };

// export default Triangle;


// import React, { useRef, useState } from 'react';
// import './Triangle.css';

// const Triangle = ({ theme, onToggle }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const toggleRef = useRef(null);

//   const handleToggle = () => {
//     setIsOpen((prev) => !prev);
//     if (onToggle) onToggle(!isOpen); // Викликаємо зовнішню функцію
//   };

//   return (
//     <div className="triangle-inl-container">
//       <div
//         ref={toggleRef}
//         className={`triangle-inl-toggle ${theme} ${isOpen ? 'rotated' : ''}`}
//         onClick={handleToggle}
//       />
//     </div>
//   );
// };

// export default Triangle;