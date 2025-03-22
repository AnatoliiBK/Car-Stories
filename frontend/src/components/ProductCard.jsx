import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { addToCart } from "../slices/cartSlice";
import { addToCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom"; // імпорт для перенаправлення
import styled from "styled-components";
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { useTheme } from "./ThemeContext"
// import FavoriteButton from "./FavoriteButton";
import { fetchTotals } from "../features/cart/cartSlice";

const ProductCard = ({ product, removeFavorite }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // хук для перенаправлення
  const { theme } = useTheme(); // Додаємо тему з контексту
  // const userId = useSelector((state) => state.users.userId); // Витягування ідентифікатора користувача
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAuthMessage, setShowAuthMessage] = useState(false); // стейт для повідомлення
  const menuRef = useRef(null);
  const user = useSelector((state) => state.auth); // Отримуємо користувача з Redux state
  // const favorites = useSelector((state) => state.favorites || []);
  // const isFavorite = favorites.productId.includes(product._id);
  // Перевіряємо чи існують favorites та productId
  // const isFavorite = favorites.some(fav => fav.productId && fav.productId._id === product._id)

  // const handleAddToCart = (product) => {
  //   dispatch(addToCart({ product, isUser }));
  //   console.log("PRODUCT CARD userId", isUser)
  //   console.log("PRODUCT CARD product", product)
  //   console.log("PRODUCT CARD product ID", product._id)
  // };

  // const handleAddToCart = (product) => {
  //   if (userId) {
  //     dispatch(addToCart({ product, userId })); // Передача продукту та ідентифікатора користувача
  //     console.log("PRODUCT CARD userId", userId);
  //     console.log("PRODUCT CARD product", product);
  //     console.log("PRODUCT CARD product ID", product._id);
  //   } else {
  //     console.error("User ID is not available");
  //   }
  // };

  useEffect(() => {
    if (user && user._id) {
      // dispatch(fetchCart(user._id));
      dispatch(fetchTotals(user._id));
    }
  }, [dispatch, user]);

  const handleAddToCart = (product) => {
    if (user && user._id) {
      dispatch(addToCart({ userId: user._id, productId: product._id, quantity: 1 }))
      .then(() => {
      dispatch(fetchTotals(user._id));
    });
    } else {
      // Відображення повідомлення або перенаправлення
      setShowAuthMessage(true);
      setTimeout(() => {
        setShowAuthMessage(false);
        navigate("/login"); // перенаправлення на сторінку входу
      }, 2000); // затримка перед перенаправленням
    }
  };

  // const toggleFullDesc = () => {
  //   setShowFullDesc((prev) => !prev);
  // };

  const handleToggleDesc = () => {
    setShowFullDesc(!showFullDesc);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowFullDesc(false);
    }
  };

  const handleClickOnMenu = () => {
    setShowFullDesc(false);
  };

  useEffect(() => {
    if (showFullDesc) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFullDesc]);

  // const handleToggleFavorite = (productId) => {
  //   // dispatch(toggleFavorite(productId));
  //   removeFavorite(productId);
  // };

  return (
    <ProductContainer>
      {/* <h3>{product.name}</h3> */}
      <Wrapper>
        <h3>{product.name}</h3>
        <FavoriteButton productId={product._id} removeFavorite={removeFavorite}/>
        {/* <FavoriteIcon onClick={() => handleToggleFavorite(product._id)}>
          {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
        </FavoriteIcon> */}
      </Wrapper>
      <Link to={`/product/${product._id}`}>
        <img src={product.image?.url} alt={product.name} />
      </Link>
      <Details>
        <span>{product.desc}</span>
        <span>${product?.price}</span>
      </Details>
      {/* <ToggleButton onClick={handleToggleDesc}>
        {showFullDesc ? "Hide Details" : "Show Details"}
      </ToggleButton> */}
      {!showFullDesc && (
        <ToggleButton onClick={handleToggleDesc}>Show Details</ToggleButton>
      )}
      
      {showFullDesc && (
        <DropdownMenu ref={menuRef} onClick={handleClickOnMenu} theme={theme}>
          <Specifications>
            <h4>Specifications:</h4>
            <ul>
              {product.fullDesc?.display && <li><strong>Display:</strong> {product.fullDesc.display}</li>}
              {product.fullDesc?.processor && <li><strong>Processor:</strong> {product.fullDesc.processor}</li>}
              {product.fullDesc?.memory && <li><strong>Memory:</strong> {product.fullDesc.memory}</li>}
              {product.fullDesc?.camera && <li><strong>Camera:</strong> {product.fullDesc.camera}</li>}
              {product.fullDesc?.battery && <li><strong>Battery:</strong> {product.fullDesc.battery}</li>}
              {product.fullDesc?.weight && <li><strong>Weight:</strong> {product.fullDesc.weight}</li>}
              {product.fullDesc?.os && <li><strong>OS:</strong> {product.fullDesc.os}</li>}
            </ul>
          </Specifications>
          <Advantages>
            <h4>Advantages:</h4>
            <ul>
              {product.fullDesc?.advantages && product.fullDesc.advantages.map((advantage, index) => (
                <li key={index}>{advantage}</li>
              ))}
            </ul>
          </Advantages>
          <Disadvantages>
            <h4>Disadvantages:</h4>
            <ul>
              {product.fullDesc?.disadvantages && product.fullDesc.disadvantages.map((disadvantage, index) => (
                <li key={index}>{disadvantage}</li>
              ))}
            </ul>
          </Disadvantages>
        </DropdownMenu>
      )}
      <button onClick={() => handleAddToCart(product)}>Add To Cart</button>
      {showAuthMessage && <AuthMessage>Будь ласка, увійдіть в систему для додавання товарів до кошика.</AuthMessage>}
    </ProductContainer>
  );
};

export default ProductCard;

const ProductContainer = styled.div`
  /* ваші стилі тут */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 15px;
  width: 250px;
  max-width: 100%;
  height: auto;
  box-shadow: -5px -5px 10px rgba(255, 255, 255, 0.5),
    2px 2px 5px rgba(94, 104, 121, 0.5);
  h3 {
    font-size: 25px;
    font-weight: 400;
  }
  img {
    width: 80%;
    margin-top: 1rem;
    margin-left: auto;
    margin-right: auto;
  }
  button {
    width: 100%;
    height: 40px;
    border-radius: 5px;
    margin-top: 2rem;
    font-weight: 400;
    letter-spacing: 1.15px;
    background-color: #4b70e2;
    color: #f9f9f9;
    border: none;
    outline: none;
    cursor: pointer;
  }
`;

// const FavoriteIcon = styled.div`
//   cursor: pointer;
// `;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  h3 {
    margin-top: 0.3rem;
    margin-bottom: 0;
  }
  button {
    margin: 0;
    flex: 0;
  }
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:nth-child(2) {
    font-size: 20px;
    font-weight: 700;
  }
`;

// const ToggleButton = styled.button`
//   width: 100%;
//   height: 30px;
//   margin-top: 1rem;
//   background-color: #007bff;
//   color: white;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
// `;

const ToggleButton = styled.div`
  width: fit-content;
  height: 25px;
  /* padding: 1px; */
  /* margin-top: 1rem; */
  /* background-color: #007bff; */
  color: #007bff;
  /* border: none;
  border-radius: 5px; */
  cursor: pointer;
`;

const Specifications = styled.div`
  margin-top: 1rem;
  h4 {
    margin-bottom: 0.5rem;
  }
  ul {
    list-style: none;
    padding: 0;
    li {
      margin-bottom: 0.5rem;
      strong {
        font-weight: bold;
      }
    }
  }
`;

const Advantages = styled.div`
  margin-top: 1rem;
  h4 {
    margin-bottom: 0.5rem;
  }
  ul {
    list-style: disc;
    padding-left: 1.5rem;
    li {
      margin-bottom: 0.5rem;
    }
  }
`;

const Disadvantages = styled.div`
  margin-top: 1rem;
  h4 {
    margin-bottom: 0.5rem;
  }
  ul {
    list-style: disc;
    padding-left: 1.5rem;
    li {
      margin-bottom: 0.5rem;
    }
  }
`;

// const DropdownMenu = styled.div`
//   position: absolute;
//   background-color: white;
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//   margin-top: 0.5rem;
//   padding: 1rem;
//   z-index: 1;
// `;

const DropdownMenu = styled.div`
  position: absolute;
  background-color: ${({ theme }) => (theme === "light" ? "white" : "#333")};
  color: ${({ theme }) => (theme === "light" ? "#000" : "#fff")};
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  padding: 1rem;
  z-index: 1;
`;

const AuthMessage = styled.div`
  color: red;
  margin-top: 10px;
  font-size: 14px;
`;

/* {showFullDesc && (
        <Specifications>
          <h4>Specifications:</h4>
          <ul>
            {product.fullDesc?.display && <li><strong>Display:</strong> {product.fullDesc.display}</li>}
            {product.fullDesc?.processor && <li><strong>Processor:</strong> {product.fullDesc.processor}</li>}
            {product.fullDesc?.memory && <li><strong>Memory:</strong> {product.fullDesc.memory}</li>}
            {product.fullDesc?.camera && <li><strong>Camera:</strong> {product.fullDesc.camera}</li>}
            {product.fullDesc?.battery && <li><strong>Battery:</strong> {product.fullDesc.battery}</li>}
            {product.fullDesc?.weight && <li><strong>Weight:</strong> {product.fullDesc.weight}</li>}
            {product.fullDesc?.os && <li><strong>OS:</strong> {product.fullDesc.os}</li>}
          </ul>
        </Specifications>
      )}
      {showFullDesc && (
        <Advantages>
          <h4>Advantages:</h4>
          <ul>
            {product.fullDesc?.advantages && product.fullDesc.advantages.map((advantage, index) => (
              <li key={index}>{advantage}</li>
            ))}
          </ul>
        </Advantages>
      )}
      {showFullDesc && (
        <Disadvantages>
          <h4>Disadvantages:</h4>
          <ul>
            {product.fullDesc?.disadvantages && product.fullDesc.disadvantages.map((disadvantage, index) => (
              <li key={index}>{disadvantage}</li>
            ))}
          </ul>
        </Disadvantages>
      )} */

