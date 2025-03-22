import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { url, setHeaders } from "../../slices/api";
import { useDispatch } from "react-redux";
import { addToCart } from "../../slices/cartSlice";
import FavoriteButton from "../FavoriteButton";
import ProductCard from "../ProductCard";

const Product = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log("PRODUCT : ", product)

  useEffect(() => {
    setLoading(true);

    async function fetchData() {
      try {
        const res = await axios.get(
          `${url}/products/find/${params.id}`,
          setHeaders()
        );

        setProduct(res.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  return (
    <StyledProduct>
      <ProductContainer>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ProductCard key={product._id} product={product} />
        )}
      </ProductContainer>
    </StyledProduct>
  );
};

export default Product;

const Specifications = styled.div`
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 20px auto;

  h2 {
    font-size: 1.5em;
    margin-bottom: 20px;
    color: #333;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 10px;
      padding: 10px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    li strong {
      display: block;
      margin-bottom: 5px;
      color: #555;
    }
  }

  .advantages,
  .disadvantages {
    margin-top: 20px;

    h3 {
      font-size: 1.2em;
      margin-bottom: 10px;
      color: #555;
    }

    ul {
      list-style-type: disc;
      padding-left: 20px;

      li {
        background-color: transparent;
        border: none;
        box-shadow: none;
      }
    }
  }
`;

const StyledProduct = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
`;

const ProductContainer = styled.div`
  max-width: 500px;
  width: 100%;
  height: auto;
  display: flex;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 5px;
  padding: 2rem;
  @media (max-width: 425.98px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ImageContainer = styled.div`
  flex: 1;

  img {
    width: 100%;
  }
`;

const ProductDetails = styled.div`
  flex: 2;
  margin-left: 2rem;
  @media (max-width: 425.98px) {
    margin-left: 0;
    display: flex;
    flex-direction: column;
    align-items: center; /* Це вирівнює всі дочірні елементи по центру */
  }

  h3 {
    font-size: 35px;
  }

  p span {
    font-weight: bold;
  }
`;

const Price = styled.div`
  margin: 1rem 0;
  font-weight: bold;
  font-size: 25px;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  h3 {
    margin-top: 0.3rem;
    margin-bottom: 0;
  }
`;

// <>
//   <ImageContainer>
//     <img src={product.image?.url} alt="product" />
//   </ImageContainer>
//   <ProductDetails>
//       <Wrapper>
//         <h3>{product.name}</h3>
//         <FavoriteButton productId={product._id} />
//     </Wrapper>

//     <p>
//       <span>Brand:</span> {product.brand}
//     </p>
//     <p>
//       <span>Description:</span> {product.desc}
//     </p>
//     <Price>${product.price?.toLocaleString()}</Price>
//     <button
//       className="product-add-to-cart"
//       onClick={() => handleAddToCart(product)}
//     >
//       Add To Cart
//     </button>
//     </ProductDetails>
// </>
