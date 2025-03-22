import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router";
// import { addToCart } from "../slices/cartSlice";
// import { useGetAllProductsQuery } from "../slices/productsApi";
// import { Link } from "react-router-dom";
// import FavoriteButton from "./FavoriteButton";
// import styled from "styled-components";
import ProductCard from "./ProductCard";

const Home = () => {
  const { productsList: data, status } = useSelector((state) => state.products);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // const { data, error, isLoading } = useGetAllProductsQuery();

  // const handleAddToCart = (product) => {
  //   dispatch(addToCart(product));
  //   navigate("/cart");
  // };

  return (
    <div className="home-container">
      {status === "success" ? (
        <>
          <h2>New Arrivals</h2>
          <div className="products">
            {data &&
              data?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </>
      ) : status === "pending" ? (
        <p>Loading...</p>
      ) : (
        <p>No download now. Please refresh the page</p>
      )}
    </div>
  );
};

export default Home;

// const Wrapper = styled.div`
//   display: flex;
//   justify-content: space-between;
//   h3 {
//     margin-top: 0.3rem;
//     margin-bottom: 0;
//   }
//   button {
//     margin: 0;
//     flex: 0;
//   }
// `
// const ProductsContainer = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 20px;
// `;

// <div key={product._id} className="product">
                //   <Wrapper>
                //     <h3>{product.name}</h3>
                //     <FavoriteButton productId={product._id} />
                //   </Wrapper>
                  
                //   <Link to={`/product/${product._id}`}>
                //     <img src={product.image.url} alt={product.name} />
                //   </Link>
                  
                //   <div className="details">
                //     <span>{product.desc}</span>
                //     <span className="price">${product.price}</span>
                //   </div>
                //   <button onClick={() => handleAddToCart(product)}>
                //     Add To Cart
                //   </button>
                // </div>