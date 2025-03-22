import React, { useState } from "react";
import Modal from "react-modal";
import AddCarForm from "./AddCarForm";
import { FaPlusCircle } from "react-icons/fa";
import "./AddCarIndicator.css";
import { useTheme } from "../components/ThemeContext";

// Встановлюємо основний елемент додатка
Modal.setAppElement("#root");

const AddCarIndicator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const { theme } = useTheme();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!isAuthenticated) return null;

  return (
    <div>
      {/* Значок */}
      <FaPlusCircle
        onClick={openModal}
        size={50}
        className="add-car-indicator"
        title="Додати автомобіль"
      />

      {/* Модальне вікно */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Car Form"
        className={` ${theme}`}
      >
        <button
          onClick={closeModal}
          className="close-modal-button"
        >
          ✖
        </button>
        {/* <h2>Додати автомобіль</h2> */}
        <AddCarForm onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default AddCarIndicator;



// import React, { useState } from "react";
// import Modal from "react-modal"; // Використовуйте бібліотеку для модальних вікон
// import AddCarForm from "./AddCarForm"; // Форма додавання автомобіля
// import { FaPlusCircle } from "react-icons/fa"; // Іконка значка

// const AddCarIndicator = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Перевірка залогіненого користувача
//   const isAuthenticated = Boolean(localStorage.getItem("token"));

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   if (!isAuthenticated) return null; // Якщо користувач не залогінений, нічого не відображати

//   return (
//     <div>
//       {/* Значок для відкриття форми */}
//       <FaPlusCircle
//         onClick={openModal}
//         size={50}
//         style={{
//           color: "green",
//           position: "fixed",
//           bottom: "20px",
//           right: "20px",
//           cursor: "pointer",
//         }}
//         title="Додати автомобіль"
//       />

//       {/* Модальне вікно з формою */}
//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={closeModal}
//         contentLabel="Add Car Form"
//         style={{
//           overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
//           content: { maxWidth: "500px", margin: "auto", borderRadius: "10px" },
//         }}
//       >
//         <button
//           onClick={closeModal}
//           style={{ float: "right", background: "none", border: "none" }}
//         >
//           ✖
//         </button>
//         <h2>Додати автомобіль</h2>
//         <AddCarForm onClose={closeModal} />
//       </Modal>
//     </div>
//   );
// };

// export default AddCarIndicator;
