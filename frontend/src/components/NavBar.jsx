import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled, { keyframes } from "styled-components";
import { logoutUser } from "../slices/authSlice";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import AddAvatar from "./AvatarUploadForm";
import { usersFetch, updateUserName } from "../slices/usersSlice";
import { fetchCart, fetchTotals } from "../features/cart/cartSlice";
import placeholderAvatar from "../assets/girl face.jpg";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled as muiStyled } from "@mui/system";
import { useTheme } from "../components/ThemeContext";
import { io } from "socket.io-client";
import axios from "axios";
import { url, setHeaders } from "../slices/api";
import HandbagIcon from "./icons/HandbagIcon";
import ThemeButton from "./icons/ThemeButton";
import permissionSound from "../sounds/notification 4.mp3"; // 🔊

const NavBar = () => {
  const dispatch = useDispatch();
  const { cartTotalQuantity } = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const { usersList } = useSelector((state) => state.users);
  const { theme } = useTheme();
  const [pendingCount, setPendingCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [permissionRequestsCount, setPermissionRequestsCount] = useState(0);
  const [permissionResponsesCount, setPermissionResponsesCount] = useState(0);

  const [showPermissionIcon, setShowPermissionIcon] = useState(false);
  const permissionAudioRef = useRef(new Audio(permissionSound)); // 🔊

  console.log("AUTH IN NAV BAR : ", auth);
  console.log("USERS LIST IN NAV BAR:", usersList);
  console.log("PERMISSION DATA IN NAV BAR: ", permissionRequestsCount);

  const user = usersList?.find((u) => u._id === auth._id);

  console.log("USER FRON USER LIST IN NAV BAR : ", user);
  console.log("AUTH ID in Navbar socket useEffect:", auth?._id);

  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarFormOpen, setIsAvatarFormOpen] = useState(false); // Стейт для відображення модального вікна форми вибору зображення
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // Стейт для відображення модального вікна зображення
  const [userAvatar, setUserAvatar] = useState(user?.avatar || ""); // Стейт для аватара користувача

  const [isNameEditOpen, setIsNameEditOpen] = useState(false); // Стан для форми імені
  const [newName, setNewName] = useState(auth.name); // Стан для нового імені

  const [isLoading, setIsLoading] = useState(true);

  console.log("USER AVATAR : ", userAvatar);

  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const imageRef = useRef(null);

  // 🔹 Функція для отримання кількості улюблених авто
  const fetchFavoritesCount = async () => {
    try {
      const response = await axios.get(`${url}/favorites`, setHeaders());
      setFavoritesCount(response.data.length);
    } catch (err) {
      console.error("Помилка завантаження улюблених авто:", err);
    }
  };

  // Виклик fetchFavoritesCount при зміні auth._id (тобто, коли входить новий користувач)
  useEffect(() => {
    if (auth._id) {
      fetchFavoritesCount();
    } else {
      setFavoritesCount(0);
    }
  }, [auth._id]);

  // Усунення перевірки cartTotalQuantity > 0: Перевірка наявності товарів у кошику
  // перед викликом fetchCart є зайвою, адже ці функції повинні завантажувати дані
  // незалежно від поточного стану.
  useEffect(() => {
    if (user && user._id) {
      setUserAvatar(user?.avatar || ""); // Оновлюємо чи авантажуємо аватар, тільки
      // якщо користувач залогінений

      // Завантажуємо дані кошика без перевірки cartTotalQuantity
      dispatch(fetchCart(user._id));
      dispatch(fetchTotals(user._id));
    }
  }, [dispatch, user]);

  const fetchAllRequests = async () => {
    try {
      const res = await axios.get(`${url}/car-specs/status`, setHeaders()); // 🔁 Ендпоінт для поточного користувача
      console.log("FETCH ALL REQUESTS IN NAV BAR : ", res.data.showIcon);
      setShowPermissionIcon(res.data.showIcon);
    } catch (error) {
      console.error("❌ Не вдалося отримати запити на дозвіл:", error);
    } finally {
      setIsLoading(false); // Завантаження завершено
    }
  };

  useEffect(() => {
    if (auth._id) {
      fetchAllRequests();
    }
  }, [auth._id]);

  // 🔹 Функція для отримання кількості х-к авто, які очікують затв. чи відх.
  const fetchPermissionRequests = async () => {
    try {
      const res = await axios.get(`${url}/car-specs/my-pending`, setHeaders()); // 🔁 Ендпоінт для поточного користувача
      setPermissionRequestsCount(res.data.count);
    } catch (error) {
      console.error("❌ Не вдалося отримати запити на дозвіл:", error);
    } finally {
      setIsLoading(false); // Завантаження завершено
    }
  };
  useEffect(() => {
    if (auth._id) {
      fetchPermissionRequests();
    } else {
      setPermissionRequestsCount(0);
    }
  }, [auth._id]);

  const fetchPermissionResponses = async () => {
    try {
      const res = await axios.get(
        `${url}/car-specs/permission-responses`,
        setHeaders()
      );
      console.log("RESPONSES PERMISSIONS IN NAV BAR", res);
      setPermissionResponsesCount(res.data.responses.length);
    } catch (error) {
      console.error("❌ Не вдалося отримати відповіді на запити:", error);
    }
  };

  useEffect(() => {
    if (auth._id) {
      fetchPermissionResponses();
    } else {
      setPermissionResponsesCount(0);
    }
  }, [auth._id]);

  useEffect(() => {
    dispatch(usersFetch());
  }, [dispatch]);

  useEffect(() => {
    setIsAdmin(auth.isAdmin);
  }, [auth.isAdmin]);

  useEffect(() => {
    // Функція для завантаження початкової кількості авто в очікуванні
    const fetchPendingCars = async () => {
      try {
        const response = await axios.get(`${url}/cars/pending`, setHeaders());
        setPendingCount(response.data.length);
      } catch (error) {
        console.error("Помилка отримання очікуючих авто:", error.message);
      } finally {
        setIsLoading(false); // Завантаження завершено
      }
    };

    fetchPendingCars(); // Виконуємо запит при завантаженні

    const socket = io(url);
    // ✅ NEW 18 06 25
    if (auth?._id) {
      console.log("🔗 Клієнт приєднується до кімнати:", auth._id);

      socket.emit("join", auth._id); // Надсилаємо userId
    }
    // 🔹 Коли додано новий автомобіль у список очікування (користувач надіслав авто)
    socket.on("pending-car-added", (newCar) => {
      setPendingCount((prev) => prev + 1);
    });

    // 🔹 Коли авто схвалене адміністратором (його видаляють зі списку очікування)
    socket.on("new-car", (approvedCar) => {
      setPendingCount((prev) => Math.max(prev - 1, 0));
    });

    // 🔹 Коли авто повністю видалене (з будь-якого списку)
    socket.on("car-deleted", (deletedCarId) => {
      setPendingCount((prev) => Math.max(prev - 1, 0));
    });

    // 🔹 Коли авто додано до улюблених чи видалено з улюблених
    socket.on("favorite-updated", ({ isFavorite }) => {
      setFavoritesCount((prev) =>
        isFavorite ? prev + 1 : Math.max(prev - 1, 0)
      );
    });

    socket.on("permission-requests-status", ({ userId, showIcon }) => {
      if (userId === auth._id) {
        console.log("🔔 Оновлення статусу запитів:", showIcon);
        setShowPermissionIcon(showIcon);
      }
    });

    // 🔹 Коли надіслано новий запит на дозвіл додати х-ки
    socket.on("permission-request-added", (data) => {
      console.log("📬 Подія надійшла:", data);
      setPermissionRequestsCount((prev) => prev + 1);
    });

    // 🔹 Коли запит на дозвіл додати х-ки підтверджено або відхилено
    socket.on("permission-request-updated", ({ userId, showIcon, ...data }) => {
      console.log("🔔 permission-request-updated отримано:", userId, auth._id);

      if (userId === auth._id) {
        // Якщо showIcon присутній, це подія для власника авто
        if (typeof showIcon === "boolean") {
          // if (showIcon !== undefined) {
          setShowPermissionIcon(showIcon); // Оновлюємо стан іконки для власника
          // Не оновлюємо лічильник відповідей, бо це не для запитувача
        } else {
          // Подія для запитувача (немає showIcon)
          setPermissionResponsesCount((prev) => prev + 1); // Збільшуємо лічильник відповідей
          // 🔊 Відтворення звуку
          if (permissionAudioRef.current) {
            permissionAudioRef.current.currentTime = 0;
            permissionAudioRef.current.play().catch((err) => {
              console.warn("🔈 Помилка відтворення аудіо:", err);
            });
          }
        }

        // Оновлення лічильника запитів (для обох користувачів, якщо потрібно)
        setPermissionRequestsCount((prev) => Math.max(prev - 1, 0));
      }
    });

    // socket.on("permission-response-deleted", fetchPermissionResponses);
    socket.on("permission-response-deleted", (data) => {
      if (data.userId === auth._id) {
        // Зменшити лічильник
        fetchPermissionResponses(); // або фетч нової кількості
      }
    });
    // socket.on("permission-request-updated", ({ userId, showIcon }) => {
    //   console.log("🔔 permission-request-updated отримано:", userId, auth._id);

    //   if (userId === auth._id) {
    //     // 🔄 Оновлення лічильника (наприклад, зменшуємо)
    //     setPermissionRequestsCount((prev) => Math.max(prev - 1, 0));
    //     setPermissionResponsesCount((prev) => prev + 1);

    //     // ✅ Якщо сервер передав showIcon — оновлюємо стан для іконки
    //     if (typeof showIcon === "boolean") {
    //       setShowPermissionIcon(showIcon); // 👈 ти маєш створити/useState для цієї іконки
    //     }
    //   }
    // });

    return () => {
      socket.off("pending-car-added");
      socket.off("new-car");
      socket.off("car-deleted");
      socket.off("favorite-updated");
      socket.off("permission-request-added");
      socket.off("permission-requests-status");
      socket.off("permission-request-updated");
      socket.off("permission-response-deleted");

      socket.disconnect(); // Відключаємо WebSocket при розмонтуванні
    };
  }, [auth._id]);

  useEffect(() => {
    const updatedUser = usersList?.find((u) => u._id === auth._id);
    setNewName(updatedUser?.name || auth.name); // Оновлюємо локальне ім'я, якщо воно змінилося
  }, [usersList, auth._id, auth.name]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Якщо меню відкрите
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }

      // Якщо модальне вікно із зображенням відкрите
      if (
        isImageModalOpen && // Перевіряємо, чи модальне вікно відкрите
        imageRef.current &&
        !imageRef.current.contains(event.target)
      ) {
        setIsImageModalOpen(false); // Закриваємо модальне вікно при кліку поза ним
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isImageModalOpen]);

  const handleAvatarUpdate = (newAvatar) => {
    setUserAvatar(newAvatar); // Оновлюємо аватар після завантаження
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // перемикач станів при кліку на олівці
  const toggleAvatarForm = () => {
    setIsAvatarFormOpen(!isAvatarFormOpen); // стан форми - відкрита або закрита. в
    // даному випадку завжди буде true - відкриватиметься, бо в toggleImageModal що
    // спрацьовує раніше і відкриває зображення з олівцем, setIsAvatarFormOpen прямо
    // встановлюється в false - закрита, а !isAvatarFormOpen робить її не false -
    // відкритою
    setIsImageModalOpen(false); // пряме встановлення стану вікна зображенняв при
    // відкритті форми
  };

  const toggleImageModal = () => {
    setIsImageModalOpen(true); // явне відкриття вікна зображення
    setIsAvatarFormOpen(false); // якщо цього не додати то форма відкриатиметься
    // через раз. тому при відкритті зображення з олівцем потрібно примусово зробити
    // стан форми закритим
  };

  const toggleNameModal = () => setIsNameEditOpen((prev) => !prev);

  const handleNameUpdate = (newName) => {
    if (!user || !user._id) return;
    dispatch(updateUserName({ userId: user._id, name: newName }))
      .unwrap() // Розгортає fulfilled/rejected для обробки результату
      .then(() => {
        toast.success("Name updated successfully!");
      })
      .catch((err) => {
        toast.error("Failed to update name.");
      });
  };

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  return (
    <nav className="nav-bar">
      <Link to="/">
        <StyledCall>
          <h2>
            <strong>Car Stories</strong>
          </h2>
        </StyledCall>
      </Link>

      {/* Виводимо елементи кошика та перемикача теми тільки на великих екранах а 
      також відображаємо кошик лише якщо він не порожній*/}
      {auth._id && cartTotalQuantity > 0 && (
        <NavLink to="/cart" className="desktop-menu">
          <CartWrapper theme={theme}>
            <HandbagIcon />
            <QuantityBadge>
              <span>{cartTotalQuantity}</span>
            </QuantityBadge>
          </CartWrapper>
        </NavLink>
      )}
      <ThemeButton />

      <HamburgerMenu ref={hamburgerRef} onClick={toggleMenu}>
        <div />
        <div />
        <div />
      </HamburgerMenu>
      <Menu ref={menuRef} isopen={isMenuOpen ? "true" : undefined}>
        {auth._id ? (
          <Links onClick={toggleMenu}>
            {/* елементи кошика та перемикача теми для малих екранів 
            також відображаємо кошик лише якщо він не порожній*/}
            <div>
              {auth._id && cartTotalQuantity > 0 && (
                <NavLink to="/cart" className="mobile-menu">
                  <CartWrapper theme={theme}>
                    <HandbagIcon />
                    <QuantityBadge>
                      <span>{cartTotalQuantity}</span>
                    </QuantityBadge>
                  </CartWrapper>
                </NavLink>
              )}
            </div>
            <div className="welcome-message">
              <img
                src={userAvatar || placeholderAvatar}
                alt="User Avatar"
                className="user-avatar"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleImageModal();
                }}
                title="Редагувати зображення"
              />
              <span
                onClick={(event) => {
                  event.stopPropagation();
                  toggleNameModal();
                }}
                title="Редагувати ім'я"
              >
                {user?.name}
              </span>

              {showPermissionIcon && (
                <Link
                  to="/my-requests"
                  title="Переглянути запити на дозвіл"
                  onClick={() => {
                    if (auth._id) {
                      fetchAllRequests(); // 🔁 отримати запити лише при кліку
                    }
                  }}
                >
                  <span>🔹</span>
                </Link>
              )}
              <Link
                to="/permission-response"
                title="Переглянути відповіді на ваші запити"
              >
                {permissionResponsesCount > 0 && (
                  <>
                    <span>📨</span>
                    <span className="response-count">
                      {permissionResponsesCount}
                    </span>
                  </>
                )}
              </Link>

              <Link to="/my-requests">
                {permissionRequestsCount > 0 && (
                  <span className="pending-badge small-badge">
                    {permissionRequestsCount}
                  </span>
                )}
              </Link>
            </div>
            {isAdmin && (
              <div>
                <Link to="/admin/pending">
                  Admin{" "}
                  {pendingCount > 0 && (
                    <span className="pending-badge">{pendingCount}</span>
                  )}
                </Link>
              </div>
            )}
            <div>
              <Link to="/favorites">
                Favorites{" "}
                {favoritesCount > 0 && (
                  <span className="pending-badge">{favoritesCount}</span>
                )}
              </Link>
            </div>
            <div
              onClick={() => {
                dispatch(logoutUser(null));
                setUserAvatar(""); // Очищаємо локальний стан аватара
                navigate("/"); // Перенаправлення на головну сторінку
                toast.warning("Logged out!", { position: "bottom-left" });
              }}
            >
              Logout
            </div>
          </Links>
        ) : (
          <AuthLinks onClick={toggleMenu}>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </AuthLinks>
        )}
      </Menu>

      {isImageModalOpen && (
        <ImageModal ref={imageRef}>
          <img
            src={userAvatar || placeholderAvatar}
            alt="Click On The Pencil"
            width={userAvatar ? "400" : "300"}
            // height={userAvatar ? "400" : "300"}
            style={{
              // borderRadius: "50%", // для круглої форми
              objectFit: "contain", // масштабування без зміни пропорцій
            }}
            // style={{ borderRadius: "50%" }}
            //cover — заповнює контейнер, зберігаючи пропорції, і може обрізати краї.
            //contain — вміщує зображення повністю, але може залишати пустий простір.
          />

          <CustomIconButton onClick={() => setIsImageModalOpen(false)}>
            <CloseIcon />
          </CustomIconButton>
          <StyledPencil
            onClick={(event) => {
              event.stopPropagation(); // Зупиняємо розповсюдження події
              toggleAvatarForm();
            }}
          >
            ✏️
          </StyledPencil>
        </ImageModal>
      )}

      {isNameEditOpen && (
        <div className="modal-overlay" onClick={() => setIsNameEditOpen(false)}>
          <ModalContent
            onClick={(e) => e.stopPropagation()} // Зупиняємо поширення події, щоб клік поза вікном закривав його
            theme={theme}
          >
            <h3>Edit Your Name</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
              autoFocus
            />
            <div className="modal-actions">
              <CancelButton
                theme={theme}
                onClick={() => {
                  setIsNameEditOpen(false);
                  setNewName(auth.name); // Повертаємо старе ім'я, якщо зміна скасована
                }}
              >
                Cancel
              </CancelButton>
              <SaveButton
                theme={theme}
                onClick={() => {
                  handleNameUpdate(newName); // Викликаємо функцію оновлення імені
                  setIsNameEditOpen(false);
                }}
              >
                Save
              </SaveButton>
            </div>
          </ModalContent>
        </div>
      )}

      {isAvatarFormOpen && (
        <AddAvatar user={user} onAvatarUpdate={handleAvatarUpdate} />
      )}
    </nav>
  );
};

export default NavBar;

// Обгортка для кошика
const CartWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  justify-content: flex-start;
  cursor: pointer;
  /* fill: currentColor; */
  /* transition: transform 0.3s ease-in-out; */
  fill: ${({ theme }) => (theme === "dark" ? "blue" : "currentColor")};
  transition: transform 0.3s ease-in-out, fill 0.3s ease-in-out;
  width: 50px;

  &:hover {
    fill: #4caf50;
    transform: scale(1.1);
  }

  @media (max-width: 900px) {
    svg {
      width: 26px;
      height: 26px;
    }
  }

  @media (max-width: 768.98px) {
    width: 40px;
  }

  @media (max-width: 426px) {
    /* width: 36px; */

    /* svg {
      width: 24px;
      height: 24px;
    } */
  }
`;

// Стиль для кількості
const QuantityBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background: yellowgreen;
  color: black;
  font-size: 12px;
  font-weight: bold;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  @media (max-width: 900px) {
    height: 18px;
    width: 18px;
    font-size: 12px;
    font-weight: 700;
  }
  /* @media (max-width: 426px) {
    height: 16px;
    width: 16px;
    font-size: 10px;
    font-weight: 700;
  } */
`;

const colorChange = keyframes`
  0% {
    color: yellow;
  }
  100% {
    color: green;
  }
`;

const colorChangeInput = keyframes`
  0% {
    color: yellow;
  }
  100% {
    color: #54eb54;
  }
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => (theme === "light" ? "white" : "#333")};
  color: ${({ theme }) => (theme === "light" ? "#000" : "#fff")};
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, color 0.3s ease;
  h3 {
    animation: ${colorChange} 1s infinite alternate;
  }

  input {
    background-color: ${({ theme }) =>
      theme === "light" ? "#f5f5f5" : "#333"};
    color: ${({ theme }) => (theme === "light" ? "#000" : "#fff")};
    padding: 5px 10px; /* Задаємо лівий відступ */
    border: 1px solid ${({ theme }) => (theme === "light" ? "#ccc" : "#555")}; /* Стиль межі */
    border-radius: 4px; /* Округлення кутів */
    width: 100%; /* Ширина для адаптивності */
    box-sizing: border-box; /* Враховує padding у ширині */
    /* animation: ${colorChangeInput} 1s infinite alternate; */
  }
`;

const CancelButton = styled.button`
  background-color: ${({ theme }) => (theme === "light" ? "#f5f5f5" : "#555")};
  color: ${({ theme }) => (theme === "light" ? "#000" : "#fff")};
  border: 1px solid ${({ theme }) => (theme === "light" ? "#ccc" : "#444")};
  padding: 5px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme === "light" ? "#e0e0e0" : "#666"};
  }

  &:active {
    background-color: ${({ theme }) =>
      theme === "light" ? "#d6d6d6" : "#777"};
  }
`;

const SaveButton = styled.button`
  background-color: ${({ theme }) =>
    theme === "light" ? "#007bff" : "#0056b3"}; /* Голубуватий фон */
  color: #fff; /* Білий текст */
  border: none;
  padding: 5px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme === "light"
        ? "#0056b3"
        : "#003d80"}; /* Темніший відтінок голубого */
  }

  &:active {
    background-color: ${({ theme }) =>
      theme === "light" ? "#004080" : "#002855"}; /* Ще темніший відтінок */
  }
`;

const CustomIconButton = muiStyled(IconButton)({
  color: "#1976d2",
  position: "absolute" /* Абсолютне позиціонування для кнопки */,
  zIndex: 1330,
  top: "10px" /* Відступ від верхнього краю */,
  right: "10px" /* Відступ від правого краю */,
  backgroundColor: "#fff",
  border: "none",
  cursor: "pointer",
  padding: 0,
  // borderRadius: "50%",
  // fontSize: "20px", // розмір іконки
  "&:focus": {
    /* transform: scale(1.05); */
    color: "blue",
  },
  "&:hover": {
    /* transform: scale(1.05); */
    color: "blue",
  },
});

// Стилі для модального вікна зображення з кнопкою редагування знизу справа
const ImageModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  border-radius: 10px;
  /* background-color: rgba(0, 0, 0, 0.1);
  padding: 0.5px;
  border-radius: 10px; */
  z-index: 1320;
  /* display: flex;
  flex-direction: column;
  align-items: center; */

  img {
    /* max-width: 100%;
    border-radius: 10px; */
    /*position: relative;  Додаємо позиціонування для контейнера зображення */
  }

  button {
    /* padding: 10px; */
    /* position: relative; */
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
`;

const HamburgerMenu = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  div {
    width: 25px;
    height: 3px;
    background-color: white;
    margin: 4px;
  }
  @media (max-width: 768.98px) {
    display: flex;
  }
`;

const Menu = styled.div`
  display: flex;
  @media (max-width: 768.98px) {
    /* display: ${(props) => (props.isopen ? "block" : "none")}; */
    /* none заважає плавному закриттю меню, тому замість display використовується */
    /* transform: ${(props) =>
      props.isopen ? "translateX(0)" : "translateX(100%)"}; */
    flex-direction: column;
    position: absolute;
    top: 60px; // Зміна залежно від висоти навігаційного меню
    right: 0;
    width: 100%;
    background-color: #333;
    z-index: 1310;
    text-align: center;
    transform: ${(props) =>
      props.isopen ? "translateX(0)" : "translateX(100%)"};
    animation: ${(props) => (props.isopen ? slideIn : slideOut)} 0.3s forwards;
    div {
      margin: 1rem auto;
      /* text-align: center; */
    }
  }
`;

const AuthLinks = styled.div`
  display: flex;
  a {
    &:last-child {
      margin-left: 2rem;
    }
  }
  @media (max-width: 425.98px) {
    /* display: block; */
    flex-direction: column;
    align-items: center;
    a {
      /* display: block; */
      width: 65px;
      margin: 0.5rem 0;
      &:last-child {
        margin-left: 0;
      }
    }
  }
`;

// const Logout = styled.div`
//   color: white;
//   cursor: pointer;
// `;

const Links = styled.div`
  color: white;
  display: flex;

  div {
    display: flex;
    align-items: center;
    cursor: pointer;
    &:nth-child(2) {
      margin-left: 2rem;
    }

    &:nth-child(3) {
      margin-left: 2rem;
    }

    &:nth-child(4) {
      margin-left: 2rem;
    }

    &:last-child {
      margin-left: 2rem;
    }
  }
  @media (max-width: 425.98px) {
    flex-direction: column;
    align-items: center;
    div {
      /* width: 60px; */
      margin: 0.5rem 0;
      &:nth-child(2) {
        margin-left: 0;
      }
      &:nth-child(3) {
        margin-left: 0;
      }
      &:nth-child(4) {
        margin-left: 0;
      }

      &:last-child {
        margin-left: 0;
      }
    }
  }
`;

const typing = keyframes`
  from { width: 0; } to { width: 100%; }
`;

const blinkCaret = keyframes`
  from, to { border-color: transparent; } 50% { border-color: black};
`;

const StyledCall = styled.div`
  background: -webkit-linear-gradient(45deg, #f3ec78, #af4261);
  -webkit-background-clip: text;
  background-clip: text; /* Додаємо стандартну властивість що забезпечить підтримку 
  браузерів, які потребують стандартної властивості background-clip без префіксів*/
  -webkit-text-fill-color: transparent;
  border-right: 0.15em solid black; /* Курсор-подібний правий бордюр */
  white-space: nowrap; /* Зберігає текст у одному рядку */
  overflow: hidden; /* Ховає переповнення тексту */
  animation: ${typing} 3.5s steps(40, end),
    ${blinkCaret} 0.75s step-end infinite; /* Анімація друку */
`;

// Створюємо keyframes для bounce-анімації
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}  
  40% {transform: translateY(-8px);} 
  60% {transform: translateY(-4px);} 
`;

// Оголошуємо стилізований компонент StyledPencil з анімацією
const StyledPencil = styled.button`
  position: absolute; /* Абсолютне позиціонування для кнопки */
  z-index: 1330;
  bottom: 10px; /* Відступ від нижнього краю */
  right: 10px; /* Відступ від правого краю */
  background-color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  font-size: 20px; // розмір іконки
  animation: ${bounce} 1.5s infinite; // підключаємо анімацію

  &:hover {
    background: transparent;
  }

  &::after {
    content: "Change";
    position: absolute;
    bottom: 100%; /* Позиціонування над кнопкою */
    right: 50%;
    transform: translateX(50%);
    background-color: #000;
    color: #fff;
    padding: 5px;
    border-radius: 5px;
    opacity: 0;
    transition: opacity 0.3s;
    white-space: nowrap;
  }

  &:hover::after {
    opacity: 1;
  }
`;

// Стилі для модального вікна зображення з кнопкою редагування під зображенням
// const ImageModal = styled.div`
//   position: fixed;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   background-color: rgba(0, 0, 0, 0.1);
//   padding: 0.5px;
//   border-radius: 10px;
//   z-index: 1000;
//   display: flex;
//   flex-direction: column;
//   align-items: center;

//   img {
//     max-width: 100%;
//     border-radius: 10px;
//   }

//   button {
//     margin-top: 20px;
//     background-color: #fff;
//     border: none;
//     cursor: pointer;
//     border-radius: 50%;
//     /* padding: 10px; */

//     img {
//       width: 20px;
//       height: 20px;
//     }
//   }
// `;

// import { Link } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import styled, { keyframes } from "styled-components";
// import { logoutUser } from "../slices/authSlice";
// import { toast } from "react-toastify";
// import { useEffect, useRef, useState } from "react";
// import ThemeButton from "./ThemeButton";
// import AvatarUploadForm from "./AvatarUploadForm"; // Імпортуємо форму завантаження аватара
// import { usersFetch } from "../slices/usersSlice";

// const NavBar = () => {
//   const dispatch = useDispatch();
//   const { cartTotalQuantity } = useSelector((state) => state.cart);
//   const auth = useSelector((state) => state.auth);
//   // const user = useSelector((state) => state.users);
//   const { usersList } = useSelector((state) => state.users);
//   console.log("userList In NavBar", usersList)

//   console.log("AUTH", auth)

//   const user = usersList?.find((u) => u._id === auth._id);
//   console.log("USER In Nav Bar", user)

//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isAvatarFormOpen, setIsAvatarFormOpen] = useState(false); // Стейт для відображення форми аватара

//   const menuRef = useRef(null);
//   const hamburgerRef = useRef(null);

//   useEffect(() => {
//     dispatch(usersFetch());
//   }, [dispatch]);

//   useEffect(() => {
//     setIsAdmin(auth.isAdmin);
//   }, [auth.isAdmin]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         menuRef.current &&
//         !menuRef.current.contains(event.target) &&
//         !hamburgerRef.current.contains(event.target)
//       ) {
//         setIsMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const toggleAvatarForm = () => {
//     setIsAvatarFormOpen(!isAvatarFormOpen); // Перемикаємо форму завантаження аватара
//   };

//   return (
//     <nav className="nav-bar">
//       <Link to="/">
//         <StyledCall>
//           <h2>
//             <strong>Digital Space</strong>
//           </h2>
//         </StyledCall>
//       </Link>
//       <Link to="/cart">
//         <div className="nav-bag">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="35"
//             height="35"
//             fill="currentColor"
//             className="bi bi-handbag-fill"
//             viewBox="0 0 16 16"
//           >
//             <path d="M8 1a2 2 0 0 0-2 2v2H5V3a3 3 0 1 1 6 0v2h-1V3a2 2 0 0 0-2-2zM5 5H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5H11v1.5a.5.5 0 0 1-1 0V5H6v1.5a.5.5 0 0 1-1 0V5z" />
//           </svg>
//           <span className="bag-quantity">
//             <span>{cartTotalQuantity}</span>
//           </span>
//         </div>
//       </Link>
//       <ThemeButton />
//       <HamburgerMenu ref={hamburgerRef} onClick={toggleMenu}>
//         <div />
//         <div />
//         <div />
//       </HamburgerMenu>
//       <Menu ref={menuRef} isopen={isMenuOpen ? "true" : undefined}>
//         {auth._id ? (
//           <Links onClick={toggleMenu}>
//             <div className="welcome-message">
//               <img
//                 src={user?.avatar || auth?.avatar} // Використовуємо оновлений аватар
//                 alt="User Avatar"
//                 className="user-avatar"
//                 onClick={toggleAvatarForm} // Відкриваємо форму при натисканні на аватар
//               />
//               {/* <img
//                 src={auth.avatar}
//                 alt="User Avatar"
//                 className="user-avatar"
//                 onClick={toggleAvatarForm} // Відкриваємо форму при натисканні на аватар
//               /> */}
//               <span onClick={toggleAvatarForm}>Welcome, {auth.name}!</span>
//             </div>
//             {isAdmin && (
//               <div>
//                 <Link to="/admin/summary">Admin</Link>
//               </div>
//             )}
//             <div>
//               <Link to="/favorites">Favorites</Link>
//             </div>
//             <div
//               onClick={() => {
//                 dispatch(logoutUser(null));
//                 toast.warning("Logged out!", { position: "bottom-left" });
//               }}
//             >
//               Logout
//             </div>
//           </Links>
//         ) : (
//           <AuthLinks onClick={toggleMenu}>
//             <Link to="/login">Login</Link>
//             <Link to="register">Register</Link>
//           </AuthLinks>
//         )}
//       </Menu>
//       {isAvatarFormOpen && <AvatarUploadForm />}{" "}
//       {/* Відображаємо форму завантаження аватара */}
//     </nav>
//   );
// };

// export default NavBar;

// import { Link } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import styled, { keyframes } from "styled-components";
// import { logoutUser } from "../slices/authSlice";
// import { toast } from "react-toastify";
// import { useEffect, useRef, useState } from "react";
// import ThemeButton from "./ThemeButton";
// import AvatarUploadForm from "./AvatarUploadForm";

// const NavBar = () => {
//   const dispatch = useDispatch();
//   const { cartTotalQuantity } = useSelector((state) => state.cart);
//   const auth = useSelector((state) => state.auth);

//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isAvatarFormOpen, setIsAvatarFormOpen] = useState(false); // Стейт для відображення форми аватара

//   const menuRef = useRef(null);
//   const hamburgerRef = useRef(null);
//   console.log("cartTotalQuantity", cartTotalQuantity);
//   useEffect(() => {
//     setIsAdmin(auth.isAdmin);
//   }, [auth.isAdmin]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       // if (menuRef.current && !menuRef.current.contains(event.target)) {
//       //   setIsMenuOpen(false);
//       // }
//       if (
//         menuRef.current &&
//         !menuRef.current.contains(event.target) &&
//         !hamburgerRef.current.contains(event.target)
//       ) {
//         setIsMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const toggleAvatarForm = () => {
//     setIsAvatarFormOpen(!isAvatarFormOpen); // Перемикаємо форму завантаження аватара
//   };

//   return (
//     <nav className="nav-bar">
//       <Link to="/">
//         <StyledCall>
//           <h2>
//             <strong>Digital Space</strong>
//           </h2>
//         </StyledCall>
//       </Link>
//       <Link to="/cart">
//         <div className="nav-bag">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="35"
//             height="35"
//             fill="currentColor"
//             className="bi bi-handbag-fill"
//             viewBox="0 0 16 16"
//           >
//             <path d="M8 1a2 2 0 0 0-2 2v2H5V3a3 3 0 1 1 6 0v2h-1V3a2 2 0 0 0-2-2zM5 5H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5H11v1.5a.5.5 0 0 1-1 0V5H6v1.5a.5.5 0 0 1-1 0V5z" />
//           </svg>
//           <span className="bag-quantity">
//             <span>{cartTotalQuantity}</span>
//           </span>
//         </div>
//       </Link>
//       <ThemeButton />
//       <HamburgerMenu ref={hamburgerRef} onClick={toggleMenu}>
//         <div />
//         <div />
//         <div />
//       </HamburgerMenu>
//       <Menu ref={menuRef} isopen={isMenuOpen ? "true" : undefined}>
//         {auth._id ? (
//           <Links onClick={toggleMenu}>
//             <div className="welcome-message">
//               <img
//                 src={auth.avatar}
//                 alt="User Avatar"
//                 className="user-avatar"
//                 onClick={toggleAvatarForm} // Відкриваємо форму при натисканні на аватар
//               />
//               <span onClick={toggleAvatarForm}>Welcome, {auth.name}!</span>
//             </div>
//             {/* <div className="welcome-message">
//               <img
//                 src={auth.avatar}
//                 alt="User Avatar"
//                 className="user-avatar"
//               />
//               <span>Welcome, {auth.name}!</span>
//             </div> */}
//             {/* <div>
//               <span>Welcome, {auth.name}</span>
//             </div> */}
//             {/* {isAdmin ? (
//             <div>
//               <Link to="/admin/summary">Admin</Link>
//             </div>
//           ) : null} */}
//             {isAdmin && (
//               <div>
//                 <Link to="/admin/summary">Admin</Link>
//               </div>
//             )}
//             <div>
//               <Link to="/favorites">Favorites</Link>
//             </div>
//             <div
//               onClick={() => {
//                 dispatch(logoutUser(null));
//                 toast.warning("Logged out!", { position: "bottom-left" });
//               }}
//             >
//               Logout
//             </div>
//           </Links>
//         ) : (
//           <AuthLinks onClick={toggleMenu}>
//             <Link to="/login">Login</Link>
//             <Link to="register">Register</Link>
//           </AuthLinks>
//         )}
//       </Menu>
//     </nav>
//   );
// };

// export default NavBar;

// const avatarFormRef = useRef(false);

// const toggleAvatarForm = () => {
//   if (!avatarFormRef.current) {
//     // Якщо форма ще не відкрита, відкриваємо її
//     setIsAvatarFormOpen(true);
//     setIsImageModalOpen(false); // Закриваємо модальне вікно
//     avatarFormRef.current = true; // Оновлюємо ref після встановлення стану
//   } else {
//     // Якщо форма вже відкрита, закриваємо її
//     setIsAvatarFormOpen(false);
//     avatarFormRef.current = false; // Оновлюємо ref після встановлення стану
//   }
// };
