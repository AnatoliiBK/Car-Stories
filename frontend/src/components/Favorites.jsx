import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Favorites.css";
import CarCard from "./CarCard";
import SearchBar from "./SearchBar"; // 25 01 25
import { setHeaders, url } from "../slices/api";
import io from "socket.io-client";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]); //  25 01 25 Додаємо для фільтрованих результатів
  const [carName, setCarName] = useState(""); //  25 01 25 Для пошуку за назвою
  const [carModel, setCarModel] = useState(""); //  25 01 25 Для пошуку за назвою
  const [year, setYear] = useState(""); // 25 01 25 Для пошуку за роком
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`${url}/favorites`, setHeaders());
        setFavorites(response.data);
        setFilteredFavorites(response.data); // 25 01 25  Спочатку показуємо всі улюблені автомобілі
        // setLoading(false);
      } catch (err) {
        setError("Не вдалося завантажити список улюблених.");
        // setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();

    // Підключення до WebSocket
    const socket = io(url);

    // Додавання / Видалення авто з улюблених
    const handleFavoriteUpdated = ({ carId, isFavorite }) => {
      setFavorites((prevFavorites) => {
        if (isFavorite) {
          // Якщо авто додається, перевіряємо, чи його немає в списку
          return prevFavorites.some((fav) => fav.car._id === carId)
            ? prevFavorites
            : [...prevFavorites, { car: { _id: carId } }];
        } else {
          // Якщо авто видаляється
          return prevFavorites.filter((fav) => fav.car._id !== carId);
        }
      });
    };

    // Обробник події для видалення автомобіля взагалі з каталогу
    const handleCarDeleted = (deletedCarId) => {
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.car._id !== deletedCarId)
      );
      setFilteredFavorites((prevFiltered) =>
        prevFiltered.filter((fav) => fav.car._id !== deletedCarId)
      );
    };

    // Підписка на події
    socket.on("favorite-updated", handleFavoriteUpdated);
    socket.on("car-deleted", handleCarDeleted);

    return () => {
      socket.off("favorite-updated", handleFavoriteUpdated);
      socket.off("car-deleted", handleCarDeleted);
      socket.disconnect();
    };
  }, []);

  // Фільтруємо улюблені автомобілі за назвою та роком  25 01 25
  useEffect(() => {
    // let filtered = favorites;
    let filtered = [...favorites];

    if (carName) {
      filtered = filtered.filter((fav) =>
        fav.car.brand.toLowerCase().includes(carName.toLowerCase())
      );
    }

    if (carModel) {
      filtered = filtered.filter((fav) =>
        fav.car.name.toLowerCase().includes(carModel.toLowerCase())
      );
    }

    if (year) {
      filtered = filtered.filter((fav) =>
        fav.car.year.toString().startsWith(year.toString())
      );
    }

    setFilteredFavorites(filtered);
  }, [carName, carModel, year, favorites]);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <SearchBar
        carName={carName}
        setCarName={setCarName}
        carModel={carModel}
        setCarModel={setCarModel}
        year={year}
        setYear={setYear}
      />
      <div className={`favorites`}>
        <h1>Мої улюблені автомобілі</h1>
        <div className="fav-list">
          {filteredFavorites.length > 0 ? (
            filteredFavorites.map((unit) => (
              <CarCard key={unit.car._id} car={unit.car} />
            ))
          ) : (
            <p className="no-cars-message">Автомобілі не знайдено 😔</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Favorites;

//   filteredCars.map((unit) => (
//   <CarCard
//     key={unit._id}
//     car={unit}
//     isFavorite={favorites.includes(unit._id)}
//     isAdmin={isAdmin}
//     onDelete={handleDeleteCar}
//   />
// ))

// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import ProductCard from "./ProductCard";
// import styled, { keyframes } from "styled-components";
// import { setHeaders, url } from "../slices/api";
// import { useTheme } from "../components/ThemeContext";
// import { Link } from "react-router-dom";

// const Favorites = () => {
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { productsList: data, status } = useSelector((state) => state.products);
//   // productsList: data - перейменування productsList в data.
//   const { theme } = useTheme(); // Додаємо тему з контексту

//   // console.log("PRODUCT LIST DATA : ", data );
//   // console.log("STATUS : ", status)
//   // console.log("favorites : ", favorites);

//   useEffect(() => {
//     async function fetchFavorites() {
//       try {
//         const res = await axios.get(`${url}/favorites`, setHeaders());
//         setFavorites(res.data);
//         // console.log("RES", res);
//       } catch (error) {
//         console.log(error);
//       }
//       setLoading(false);
//     }
//     fetchFavorites();
//   }, []);

//   // Створюємо масив ідентифікаторів productId
//   const favoriteProductIds = favorites.map((fav) => fav.productId?._id);

//   // Фільтруємо продукти на основі наявності їх ідентифікатора в масиві favoriteProductIds
//   const favoriteProducts = data.filter((product) => {
//     return favoriteProductIds.includes(product._id);
//   });

//   const removeFavorite = (productId) => {
//     setFavorites(favorites.filter((fav) => fav.productId._id !== productId));
//   };

//   return (
//     <FavoritesContainer>
//       <StyledCall theme={theme}>
//         <h2>Favorites</h2>
//       </StyledCall>

//       {status === "success" ? (
//         <ProductsContainer>
//           {favoriteProducts.length > 0 ? (
//             favoriteProducts.map((product) => (
//               <ProductCard
//                 key={product._id}
//                 product={product}
//                 removeFavorite={removeFavorite}
//               />
//             ))
//           ) : (
//             <StyledNoFavorites>
//               <p>No favorite products found</p>
//               <Link to="/">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="20"
//                   height="20"
//                   fill="blue"
//                   className="bi bi-arrow-left"
//                   viewBox="0 0 16 16"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
//                   />
//                 </svg>
//                 <span>Turn To Select</span>
//               </Link>
//             </StyledNoFavorites>
//           )}
//         </ProductsContainer>
//       ) : status === "pending" || loading ? (
//         <p>Loading...</p>
//       ) : (
//         <p>Unexpected error occurred...</p>
//       )}
//     </FavoritesContainer>
//   );
// };

// export default Favorites;

// const FavoritesContainer = styled.div`
//   padding: 2rem 0;

//   h2 {
//     font-size: 40px;
//     font-weight: 400;
//     text-align: center;
//     @media (max-width: 375px) {
//       font-size: 30px;
//     }
//   }
// `;

// const StyledNoFavorites = styled.div`
//   margin: 20px auto 0 auto;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   color: gray;
//   p {
//     font-size: 30px;
//     @media(max-width: 375px) {
//       font-size: 25px;
//     }
//   }
//   a {
//     text-decoration: none;
//   }
//   span {
//     font-size: 22px;
//     /* margin: auto; */
//     color: gray;
//   }
// `

// const ProductsContainer = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 20px;

// `;

// // const StyledTurn = styled.div`
// //   color: gray;
// //   text-decoration: none;
// // `

// const typing = keyframes`
//   from { width: 0; } to { width: 100%; }
// `;

// // const blinkCaret = keyframes`
// //   from, to { border-color: transparent; } 50% { border-color: black};
// // `;
// const blinkCaret = (borderColor) => keyframes`
//   from, to { border-color: rgba(0, 0, 0, 0); }
//   50% { border-color: ${borderColor}; }
// `;

// const StyledCall = styled.div`
//   background: -webkit-linear-gradient(45deg, #f3ec78, #af4261);
//   /* -webkit-background-clip: text; */
//   background-clip: text;
//   -webkit-text-fill-color: transparent;
//   /* border-right: .15em solid black; /* Курсор-подібний правий бордюр */
//   border-right: 0.15em solid
//     ${(props) => (props.theme === "light" ? "black" : "white")}; /* Курсор-подібний правий бордюр */
//   white-space: nowrap; /* Зберігає текст у одному рядку */
//   overflow: hidden; /* Ховає переповнення тексту */
//   animation: ${typing} 3.5s steps(40, end),
//     ${blinkCaret} 0.75s step-end infinite; /* Анімація друку */
// `;
