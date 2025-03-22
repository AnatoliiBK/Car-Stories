import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import PayButton from '../components/PayButton';
import {
  fetchCart,
  addToCart,
  decreaseCart,
  removeFromCart,
  clearCart,
  fetchTotals
} from '../features/cart/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, cartTotalAmount, status } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth);
  
  console.log("CART STATE CART", cart)

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchCart(user._id));
      dispatch(fetchTotals(user._id));
    }
  }, [dispatch, user]);

  const handleAdd = (cartItem) => {
    dispatch(addToCart({ userId: user._id, userName: user.name, productId: cartItem.product._id, quantity: 1 }))
    .then(() => {
      dispatch(fetchTotals(user._id));
      dispatch(fetchCart(user._id));
    });
  };

  const handleDecrease = (cartItem) => {
    dispatch(decreaseCart({ userId: user._id, productId: cartItem.product._id, quantity: 1 }))
    .then(() => {
      dispatch(fetchTotals(user._id));
      dispatch(fetchCart(user._id));
    });
  };

  const handleRemove = (cartItem) => {
    dispatch(removeFromCart({ userId: user._id, productId: cartItem.product._id }))
    .then(() => {
      dispatch(fetchTotals(user._id));
      dispatch(fetchCart(user._id));
    });
  };

  const handleClear = () => {
    dispatch(clearCart(user._id))
    .then(() => {
      dispatch(fetchTotals(user._id));
      dispatch(fetchCart(user._id));
    });
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {!cart || cart.items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is currently empty</p>
          <div className="start-shopping">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="titles">
            <h3 className="product-title">Product</h3>
            <h3 className="price">Price</h3>
            <h3 className="quantity">Quantity</h3>
            <h3 className="total">Total</h3>
          </div>
          <div className="cart-items">
            {cart.items &&
              cart.items.map((cartItem) => (
                <div className="cart-item" key={cartItem._id}>
                  <div className="cart-product">
                    {/* <img
                      src={cartItem.product.image ? cartItem.product.image.url : 'no-image-available.jpg'}
                      alt={cartItem.product.name}
                    /> */}
                    {/* <img src={cartItem.product.image?.url || "No Image Available"} alt={cartItem.product.name} /> */}
                    {cartItem.product.image && cartItem.product.image.url ? (
                    <img src={cartItem.product.image.url} alt={cartItem.product.name} />
                  ) : (
                    <img src="*" alt="No Img Available" />
                  )}

                    <div>
                      <h3>{cartItem.product.name}</h3>
                      <p>{cartItem.product.desc}</p>
                      <button onClick={() => handleRemove(cartItem)}>Remove</button>
                    </div>
                  </div>
                  <div className="cart-product-price">${cartItem.product.price}</div>
                  <div className="cart-product-quantity">
                    <button onClick={() => handleDecrease(cartItem)}>-</button>
                    <div className="count">{cartItem.quantity}</div>
                    <button onClick={() => handleAdd(cartItem)}>+</button>
                  </div>
                  <div className="cart-product-total-price">
                    ${cartItem.product.price * cartItem.quantity}
                  </div>
                </div>
              ))}
          </div>
          <div className="cart-summary">
            <button className="clear-btn" onClick={() => handleClear()}>
              Clear Cart
            </button>
            <div className="cart-checkout">
              <div className="subtotal">
                <span>Subtotal</span>
                <span className="amount">${cartTotalAmount}</span>
              </div>
              <p>Taxes and shipping calculated at checkout</p>
              {user ? (
                <PayButton cartItems={cart.items} />
              ) : (
                <button className="cart-login" onClick={() => navigate("/login")}>
                  Login to Check out
                </button>
              )}
              <div className="continue-shopping">
                <Link to="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-arrow-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                    />
                  </svg>
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;





// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import PayButton from '../components/PayButton';
// import {
//   fetchCart,
//   addToCart,
//   decreaseCart,
//   removeFromCart,
//   clearCart,
//   fetchTotals
// } from '../features/cart/cartSlice';

// const Cart = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { cart, cartTotalAmount, status } = useSelector((state) => state.cart);
//   const user = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (user) {
//       dispatch(fetchCart(user._id));
//       dispatch(fetchTotals(user._id));
//     }
//   }, [dispatch, user]);

//   const handleAdd = (cartItem) => {
//     dispatch(addToCart({ userId: user._id, productId: cartItem.product._id, quantity: 1 }));
//     dispatch(fetchTotals(user._id)); // Fetch totals after adding item
//   };

//   const handleDecrease = (cartItem) => {
//     dispatch(decreaseCart({ userId: user._id, productId: cartItem.product._id, quantity: 1 }));
//     dispatch(fetchTotals(user._id)); // Fetch totals after decreasing item
//   };

//   const handleRemove = (cartItem) => {
//     dispatch(removeFromCart({ userId: user._id, productId: cartItem.product._id }));
//     dispatch(fetchTotals(user._id)); // Fetch totals after removing item
//   };

//   const handleClear = () => {
//     dispatch(clearCart(user._id));
//     dispatch(fetchTotals(user._id)); // Fetch totals after clearing cart
//   };

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="cart-container">
//       <h2>Shopping Cart</h2>
//       {!cart || cart.items.length === 0 ? (
//         <div className="cart-empty">
//           <p>Your cart is currently empty</p>
//           <div className="start-shopping">
//             <Link to="/">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="20"
//                 height="20"
//                 fill="currentColor"
//                 className="bi bi-arrow-left"
//                 viewBox="0 0 16 16"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
//                 />
//               </svg>
//               <span>Start Shopping</span>
//             </Link>
//           </div>
//         </div>
//       ) : (
//         <div>
//           <div className="titles">
//             <h3 className="product-title">Product</h3>
//             <h3 className="price">Price</h3>
//             <h3 className="quantity">Quantity</h3>
//             <h3 className="total">Total</h3>
//           </div>
//           <div className="cart-items">
//             {cart.items &&
//               cart.items.map((cartItem) => (
//                 <div className="cart-item" key={cartItem.product._id}>
//                   <div className="cart-product">
//                     <img
//                       src={cartItem.product.image ? cartItem.product.image.url : 'no-image-available.jpg'}
//                       alt={cartItem.product.name}
//                     />
//                     <div>
//                       <h3>{cartItem.product.name}</h3>
//                       <p>{cartItem.product.desc}</p>
//                       <button onClick={() => handleRemove(cartItem)}>Remove</button>
//                     </div>
//                   </div>
//                   <div className="cart-product-price">${cartItem.product.price}</div>
//                   <div className="cart-product-quantity">
//                     <button onClick={() => handleDecrease(cartItem)}>-</button>
//                     <div className="count">{cartItem.quantity}</div>
//                     <button onClick={() => handleAdd(cartItem)}>+</button>
//                   </div>
//                   <div className="cart-product-total-price">
//                     ${cartItem.product.price * cartItem.quantity}
//                   </div>
//                 </div>
//               ))}
//           </div>
//           <div className="cart-summary">
//             <button className="clear-btn" onClick={() => handleClear()}>
//               Clear Cart
//             </button>
//             <div className="cart-checkout">
//               <div className="subtotal">
//                 <span>Subtotal</span>
//                 <span className="amount">${cartTotalAmount}</span>
//               </div>
//               <p>Taxes and shipping calculated at checkout</p>
//               {user ? (
//                 <PayButton cartItems={cart.items} />
//               ) : (
//                 <button className="cart-login" onClick={() => navigate("/login")}>
//                   Login to Check out
//                 </button>
//               )}
//               <div className="continue-shopping">
//                 <Link to="/">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="20"
//                     height="20"
//                     fill="currentColor"
//                     className="bi bi-arrow-left"
//                     viewBox="0 0 16 16"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
//                     />
//                   </svg>
//                   <span>Continue Shopping</span>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;















// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addToCart,
//   clearCart,
//   decreaseCart,
//   getTotals,
//   removeFromCart,
// } from "../slices/cartSlice";

// import { Link } from "react-router-dom";
// import PayButton from "./PayButton";

// const Cart = () => {
//   const cart = useSelector((state) => state.cart);
//   const auth = useSelector((state) => state.auth);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     dispatch(getTotals());
//   }, [cart, dispatch]);

//   const handleAddToCart = (product) => {
//     dispatch(addToCart(product));
//   };
//   const handleDecreaseCart = (product) => {
//     dispatch(decreaseCart(product));
//   };
//   const handleRemoveFromCart = (product) => {
//     dispatch(removeFromCart(product));
//   };
//   const handleClearCart = () => {
//     dispatch(clearCart());
//   };
//   return (
//     <div className="cart-container">
//       <h2>Shopping Cart</h2>
//       {cart.cartItems.length === 0 ? (
//         <div className="cart-empty">
//           <p>Your cart is currently empty</p>
//           <div className="start-shopping">
//             <Link to="/">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="20"
//                 height="20"
//                 fill="currentColor"
//                 className="bi bi-arrow-left"
//                 viewBox="0 0 16 16"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
//                 />
//               </svg>
//               <span>Start Shopping</span>
//             </Link>
//           </div>
//         </div>
//       ) : (
//         <div>
//           <div className="titles">
//             <h3 className="product-title">Product</h3>
//             <h3 className="price">Price</h3>
//             <h3 className="quantity">Quantity</h3>
//             <h3 className="total">Total</h3>
//           </div>
//           <div className="cart-items">
//             {cart.cartItems &&
//               cart.cartItems.map((cartItem) => (
//                 <div className="cart-item" key={cartItem._id}>
//                   <div className="cart-product">
//                     <img src={cartItem.image.url} alt={cartItem.name} />
//                     <div>
//                       <h3>{cartItem.name}</h3>
//                       <p>{cartItem.desc}</p>
//                       <button onClick={() => handleRemoveFromCart(cartItem)}>
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                   <div className="cart-product-price">${cartItem.price}</div>
//                   <div className="cart-product-quantity">
//                     <button onClick={() => handleDecreaseCart(cartItem)}>
//                       -
//                     </button>
//                     <div className="count">{cartItem.cartQuantity}</div>
//                     <button onClick={() => handleAddToCart(cartItem)}>+</button>
//                   </div>
//                   <div className="cart-product-total-price">
//                     ${cartItem.price * cartItem.cartQuantity}
//                   </div>
//                 </div>
//               ))}
//           </div>
//           <div className="cart-summary">
//             <button className="clear-btn" onClick={() => handleClearCart()}>
//               Clear Cart
//             </button>
//             <div className="cart-checkout">
//               <div className="subtotal">
//                 <span>Subtotal</span>
//                 <span className="amount">${cart.cartTotalAmount}</span>
//               </div>
//               <p>Taxes and shipping calculated at checkout</p>
//               {auth._id ? (
//                 <PayButton cartItems={cart.cartItems} />
//               ) : (
//                 <button
//                   className="cart-login"
//                   onClick={() => navigate("/login")}
//                 >
//                   Login to Check out
//                 </button>
//               )}

//               <div className="continue-shopping">
//                 <Link to="/">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="20"
//                     height="20"
//                     fill="currentColor"
//                     className="bi bi-arrow-left"
//                     viewBox="0 0 16 16"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
//                     />
//                   </svg>
//                   <span>Continue Shopping</span>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;














// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addToCart,
//   clearCart,
//   decreaseCart,
//   getTotals,
//   removeFromCart,
// } from "../slices/cartSlice";

// import { Link } from "react-router-dom";
// import PayButton from "./PayButton";

// const Cart = () => {
//   const cart = useSelector((state) => state.cart);
//   const auth = useSelector((state) => state.auth);
//   console.log("cart SELECTOR", cart)
//   console.log("auth SELECTOR", auth)
//   console.log("userID", auth._id)

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     dispatch(getTotals());
//   }, [cart, dispatch]);

//   const handleAddToCart = (product) => {
//     dispatch(addToCart({ userId: auth._id, productId: product._id }));
//   };
//   const handleDecreaseCart = (product) => {
//     dispatch(decreaseCart({ userId: auth._id, productId: product._id }));
//   };
//   const handleRemoveFromCart = (product) => {
//     dispatch(removeFromCart({ userId: auth._id, productId: product._id }));
//   };
//   const handleClearCart = () => {
//     dispatch(clearCart(auth._id));
//   };
  
//   return (
//     <div className="cart-container">
//       <h2>Shopping Cart</h2>
//       {cart.cartItems.length === 0 ? (
//         <div className="cart-empty">
//           <p>Your cart is currently empty</p>
//           <div className="start-shopping">
//             <Link to="/">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="20"
//                 height="20"
//                 fill="currentColor"
//                 className="bi bi-arrow-left"
//                 viewBox="0 0 16 16"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
//                 />
//               </svg>
//               <span>Start Shopping</span>
//             </Link>
//           </div>
//         </div>
//       ) : (
//         <div>
//           <div className="titles">
//             <h3 className="product-title">Product</h3>
//             <h3 className="price">Price</h3>
//             <h3 className="quantity">Quantity</h3>
//             <h3 className="total">Total</h3>
//           </div>
//           <div className="cart-items">
//             {cart.cartItems &&
//               cart.cartItems.map((cartItem) => (
//                 <div className="cart-item" key={cartItem._id}>
//                   <div className="cart-product">
//                     <img src={cartItem.image.url} alt={cartItem.name} />
//                     <div>
//                       <h3>{cartItem.name}</h3>
//                       <p>{cartItem.desc}</p>
//                       <button onClick={() => handleRemoveFromCart(cartItem)}>
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                   <div className="cart-product-price">${cartItem.price}</div>
//                   <div className="cart-product-quantity">
//                     <button onClick={() => handleDecreaseCart(cartItem)}>
//                       -
//                     </button>
//                     <div className="count">{cartItem.cartQuantity}</div>
//                     <button onClick={() => handleAddToCart(cartItem)}>+</button>
//                   </div>
//                   <div className="cart-product-total-price">
//                     ${cartItem.price * cartItem.cartQuantity}
//                   </div>
//                 </div>
//               ))}
//           </div>
//           <div className="cart-summary">
//             <button className="clear-btn" onClick={handleClearCart}>
//               Clear Cart
//             </button>
//             <div className="cart-checkout">
//               <div className="subtotal">
//                 <span>Subtotal</span>
//                 <span className="amount">${cart.cartTotalAmount}</span>
//               </div>
//               <p>Taxes and shipping calculated at checkout</p>
//               {auth._id ? (
//                 <PayButton cartItems={cart.cartItems} />
//               ) : (
//                 <button
//                   className="cart-login"
//                   onClick={() => navigate("/login")}
//                 >
//                   Login to Check out
//                 </button>
//               )}

//               <div className="continue-shopping">
//                 <Link to="/">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="20"
//                     height="20"
//                     fill="currentColor"
//                     className="bi bi-arrow-left"
//                     viewBox="0 0 16 16"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
//                     />
//                   </svg>
//                   <span>Continue Shopping</span>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;
